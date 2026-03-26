import { inject, Injectable } from '@angular/core';
import { Message } from './shared/types';
import { SupabaseService } from '../../../core/supabase/supabase-service';
import { PASSING_SCORE, SYSTEM_INSTRUCTION } from './shared/prompt';

@Injectable()
export class GeminiService {
  private readonly supabase = inject(SupabaseService).client;

  async ask(history: Message[]): Promise<string> {
    const maxPassingScore = 100;
    if (PASSING_SCORE > 100) {
      throw new Error(`Passing score is set to ${PASSING_SCORE}. It has to be <= ${maxPassingScore}`);
    }

    const { data, error } = await this.supabase.functions.invoke('gemini-proxy', {
      body: {
        model: 'gemini-2.5-flash-lite',
        contents: history,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
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
