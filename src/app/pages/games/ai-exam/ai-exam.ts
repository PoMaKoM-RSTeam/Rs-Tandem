import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { AiExamOllamaService } from './ollama.service';

@Component({
  selector: 'tndm-ai-exam',
  templateUrl: 'ai-exam.html',
  styleUrl: 'ai-exam.scss',
  imports: [TndmButton],
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

    const answer = await this.ollama.ask(`3+3 `);
    this.currentQuestion.set(answer);
    this.isLoading.set(false);
  }
}
