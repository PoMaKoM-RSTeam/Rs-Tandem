// THIS FILE USES NVIDIA AI API. When you decide to use get back to this file it just works
// THIS FILE USES NVIDIA AI API. When you decide to use get back to this file it just works
// THIS FILE USES NVIDIA AI API. When you decide to use get back to this file it just works
// THIS FILE USES NVIDIA AI API. When you decide to use get back to this file it just works
// THIS FILE USES NVIDIA AI API. When you decide to use get back to this file it just works

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { AiExamOllamaService } from './ollama.service';

@Component({
  selector: 'tndm-ai-exam',
  templateUrl: 'ai-exam.html',
  styleUrl: 'ai-exam.scss',
  imports: [TndmButton],
  providers: [AiExamOllamaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmAiExam {
  private readonly ollama = inject(AiExamOllamaService);
  readonly currentQuestion = signal('');
  readonly isLoading = signal(false);

  async generateQuestion(): Promise<void> {
    if (this.isLoading()) {
      return;
    }
    this.isLoading.set(true);

    try {
      const answer = await this.ollama.ask(`What is a function in programming?`);
      this.currentQuestion.set(answer);
    } catch (error) {
      console.error('NVIDIA API Error:', error);
      this.currentQuestion.set('Failed to connect to the AI tutor.');
    } finally {
      this.isLoading.set(false);
    }
  }
}
