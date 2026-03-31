import { inject, Injectable } from '@angular/core';
import { Message } from '../../shared/types';
import { SupabaseService } from '../../../../../core/supabase/supabase-service';
import { PASSING_SCORE, SYSTEM_INSTRUCTION } from './prompt';

export type GeminiResponse = {
  isExamFinished: boolean;
  isExamPassed: boolean;
  message: string;
  score: number;
};

@Injectable()
export class GeminiService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly MODELS = {
    'gemini-3.1-pro': 'gemini-3.1-pro-preview',
    'gemini-3.1-flash': 'gemini-3-flash-preview',
    'gemini-3.1-flash-lite': 'gemini-3.1-flash-lite-preview',
    'gemini-2.5-flash': 'gemini-2.5-flash',
    'gemini-2.5-flash-lite': 'gemini-2.5-flash-lite',
    'gemini-2.5-pro': 'gemini-2.5-pro',
  };

  async ask(history: Message[]): Promise<GeminiResponse> {
    const maxPassingScore = 100;
    if (PASSING_SCORE > 100) {
      throw new Error(`Passing score is set to ${PASSING_SCORE}. It has to be <= ${maxPassingScore}`);
    }

    const { data, error } = await this.supabase.functions.invoke('gemini-proxy', {
      body: {
        useFreeTier: true,
        // model: this.MODELS['gemini-3.1-flash'],
        model: this.MODELS['gemini-3.1-flash-lite'],
        // model: this.MODELS['gemini-2.5-flash-lite'],
        contents: history,
        systemInstruction: {
          parts: [{ text: SYSTEM_INSTRUCTION }],
        },
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'object',
            properties: {
              isExamFinished: {
                type: 'boolean',
                description: `Set to true IF the user score is >= ${PASSING_SCORE} or Remaining attempts == 0.
                Set to false otherwise.`,
              },
              isExamPassed: {
                type: 'boolean',
                description: `Set only when isExamFinished is true: true if the user passed, false if the user failed.`,
              },
              score: {
                type: 'number',
                description: `Numeric exam score from 0 to 100.`,
              },
              message: {
                type: 'string',
                description: 'The markdown-formatted message to show to the user.',
              },
            },
            required: ['isExamFinished', 'isExamPassed', 'score', 'message'],
          },
        },
      },
    });

    if (error) {
      console.error('API or Supabase Edge Function error:', error);
      return {
        isExamFinished: false,
        isExamPassed: false,
        score: 0,
        message: `Oops! I experienced a brain freeze 🥶.
        Check the console to see the full error message.`,
      };
    }

    if (!data) {
      return {
        isExamFinished: false,
        isExamPassed: false,
        score: 0,
        message: `Oops! The response I received from the server is empty 😢`,
      };
    }

    if (!data.text) {
      console.warn(data);
      return {
        isExamFinished: false,
        isExamPassed: false,
        score: 0,
        message: `Oops! The response I received from the server is a mess.
        I couldn't find the text I'm supposed to show you.
        Check the console to see what I received from the server.`,
      };
    }

    try {
      return JSON.parse(data.text);
    } catch (parsingError) {
      console.error(`Failed to parse JSON from Gemini. Error: ${parsingError}`);
      console.log(`Parsed data: ${data.text}`);
      return {
        isExamFinished: false,
        isExamPassed: false,
        score: 0,
        message: `Oops! The AI returned an invalid format. Raw response:
        ${data.text}`,
      };
    }
  }
}
