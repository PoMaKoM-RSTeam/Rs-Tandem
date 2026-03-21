// THIS FILE USES NVIDIA AI API. When you decide to use get back to this file it just works
// THIS FILE USES NVIDIA AI API. When you decide to use get back to this file it just works
// THIS FILE USES NVIDIA AI API. When you decide to use get back to this file it just works
// THIS FILE USES NVIDIA AI API. When you decide to use get back to this file it just works
// THIS FILE USES NVIDIA AI API. When you decide to use get back to this file it just works

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';

const ROLES = {
  user: 'user',
  assistant: 'assistant',
  system: 'system',
} as const;

type ChatCompletionResponse = {
  choices: {
    index?: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason?: string | null;
  }[];
};

@Injectable()
export class AiExamOllamaService {
  private readonly http = inject(HttpClient);

  // Ensure these exist in your environment.ts
  private readonly supabaseKey = environment.supabaseKey;
  private readonly supabaseUrl = environment.supabaseUrl;
  private readonly functionUrl = `${this.supabaseUrl}/functions/v1/nvidia-proxy`;

  // ADDED: The missing variables your body requires
  private readonly model = 'moonshotai/kimi-k2.5';
  // private readonly model = 'meta/llama-3.1-70b-instruct';
  // private readonly model = '"deepseek-ai/deepseek-r1"';
  private readonly systemInstructions = `
    You are a JavaScript Tutor. Your goal is to help the user pass a JavaScript exam.
    Ask ONE technical JavaScript question at a time. Output ONLY the question.
  `;

  async ask(question: string): Promise<string> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: this.supabaseKey, // Added: Supabase needs this header too
      'Content-Type': 'application/json',
    });

    const body = {
      model: this.model,
      messages: [
        // { role: ROLES.system, content: this.systemInstructions },
        { role: ROLES.user, content: question },
      ],
      temperature: 0.6,
      extra_body: {
        chat_template_kwargs: { thinking: false },
      },
    };

    const response$ = this.http.post<ChatCompletionResponse>(this.functionUrl, body, { headers });
    const result = await lastValueFrom(response$);

    const content = result?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('Chat completion returned no message content.');
    }
    return content;
  }
}
