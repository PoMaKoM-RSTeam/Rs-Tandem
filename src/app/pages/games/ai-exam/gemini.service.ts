import { inject, Injectable } from '@angular/core';
import { Message } from './shared/types';
import { SupabaseService } from '../../../core/supabase/supabase-service';

@Injectable()
export class GeminiService {
  private readonly supabase = inject(SupabaseService).client;

  private readonly PASSING_SCORE = 80;
  private readonly PERSONA = 'JavaScript Tutor';
  private readonly SYSTEM_INSTRUCTION = `You are a ${this.PERSONA}.
  Your goal is to help the user pass a JavaScript exam.
RULES:
- Ask ONE technical JavaScript question at a time and include a small block of code as an exammple.
- Rate every answer from ${this.PASSING_SCORE}% to 100%.
- Do NOT give the full answer. If the answer is wrong or incomplete, ask guiding questions to lead them to the truth.
- The user must reach ${this.PASSING_SCORE}% accuracy through their own reasoning.
- When they hit ${this.PASSING_SCORE}%, you MUST say: 'You passed! Congrats!' and DON'T ask another question.
- Only one question is required. If the user reaches the threshold don't ask another question.
`;

  async ask(history: Message[]): Promise<string> {
    const { data, error } = await this.supabase.functions.invoke('gemini-proxy', {
      body: {
        model: 'gemini-2.5-flash-lite',
        contents: history,
        systemInstruction: {
          parts: [{ text: this.SYSTEM_INSTRUCTION }],
        },
      },
    });

    if (error) {
      console.error('API or Supabase Edge Function error:', error);
      return `Oops! I experienced a brain freeze 🥶.
      Check the console to see the full error message.`;
    }

    if (!data) {
      return `Oops! The response I received from the server is empty 😢`;
    }

    if (!data.text) {
      console.warn(data);
      return `Oops! The response I received from the server is a mess.
      I couldn't find the text I'm supposed to show you.
      Check the console to see what I received from the server.`;
    }

    return data.text;
  }
}
