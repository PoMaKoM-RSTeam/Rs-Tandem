import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TndmButton } from '../../../../../shared/ui/tndm-button/tndm-button';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'tndm-completion-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TndmButton, TranslocoPipe],
  styleUrl: './review-modal.scss',
  templateUrl: './review-modal.html',
})
export class TndmCompletionModal {
  readonly score = input.required<number>();
  readonly maxScore = input.required<number>();
  readonly nextCase = output<void>();
  readonly closed = output<void>();

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.closed.emit();
    }
  }
}
