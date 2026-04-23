import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ErrorType } from '../../models/error-type.enum';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'tndm-review-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
  styleUrl: './review-tooltip.scss',
  templateUrl: './review-tooltip.html',
})
export class TndmReviewTooltip {
  readonly wrongType = input(false);
  readonly typeSelected = output<ErrorType>();
  readonly closed = output<void>();

  readonly errorTypes: ErrorType[] = [
    ErrorType.MemoryLeak,
    ErrorType.Performance,
    ErrorType.BestPractice,
    ErrorType.Security,
  ];
}
