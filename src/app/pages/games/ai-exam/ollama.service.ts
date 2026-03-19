import { inject, Injectable } from '@angular/core';
import { OllamaService } from '../../../core/ollama/ollama-service';

@Injectable({ providedIn: 'root' })
export class AiExamOllamaService {
  private readonly ollama = inject(OllamaService).client;

  async ask(question: string): Promise<string> {
    const response = await this.ollama.chat({
      model: 'phi3',
      messages: [{ role: 'user', content: question }],
    });
    return response.message.content;
  }
}
