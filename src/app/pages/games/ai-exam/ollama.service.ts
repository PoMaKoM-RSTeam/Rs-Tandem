import { inject, Injectable } from '@angular/core';
import { OllamaService } from '../../../core/ollama/ollama-service';

const ROLES = {
  user: 'user',
  assistant: 'assistant',
  system: 'system',
} as const;

@Injectable()
export class AiExamOllamaService {
  private readonly ollama = inject(OllamaService).client;

  private readonly systemInstructions = `
You are a JavaScript Tutor. Your goal is to help the user pass a JavaScript exam.
RULES:
1. Ask ONE technical JavaScript question at a time.
2. OUTPUT ONLY THE QUESTION. Do not say "Great," "Here is your challenge," or "Hello."
3. No conversational filler. Just the technical content.
4. Rate every answer from 0% to 100%.
5. Do NOT give the full answer. If the answer is wrong or incomplete, ask guiding questions to lead them to the truth.
6. The user must reach 90% accuracy through their own reasoning.
7. When they hit 90%+, you MUST say: 'You passed! Congrats!'
`;

  async ask(question: string): Promise<string> {
    const response = await this.ollama.chat({
      model: 'deepseek-r1:8b',
      messages: [
        { role: ROLES.system, content: this.systemInstructions },
        { role: ROLES.user, content: question },
      ],
    });
    return response.message.content;
  }
}
