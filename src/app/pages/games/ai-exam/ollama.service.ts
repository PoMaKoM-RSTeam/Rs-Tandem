import { inject, Injectable } from '@angular/core';
import { OllamaService } from '../../../core/ollama/ollama-service';
import { Message, ROLES } from './shared/types';

@Injectable()
export class AiExamOllamaService {
  private readonly ollama = inject(OllamaService).client;

  async ask(newQuestion: string, chatHistory: Message[]): Promise<string> {
    const response = await this.ollama.chat({
      // model: 'deepseek-r1:8b',
      model: 'llama3.1',
      messages: [...chatHistory, { role: ROLES.user, content: newQuestion }],
    });
    return response.message.content;
  }
}
