import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { OllamaService } from './ollama.service';

@Component({
  selector: 'tndm-ai-exam',
  templateUrl: 'ai-exam.html',
  styleUrl: 'ai-exam.scss',
  imports: [TndmButton],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmAiExam {
  readonly ollama = new OllamaService();

  generateQuestion(): void {
    this.ollama.ask('3+3');
  }
}
