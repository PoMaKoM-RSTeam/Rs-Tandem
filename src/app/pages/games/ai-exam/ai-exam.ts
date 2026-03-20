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

    const answer = await this.ollama.ask(`I'm ready. Ask me a question on JavaScript`);
    this.currentQuestion.set(answer);
    this.isLoading.set(false);
  }
}
