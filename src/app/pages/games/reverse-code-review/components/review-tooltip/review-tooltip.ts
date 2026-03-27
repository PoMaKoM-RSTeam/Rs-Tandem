import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ErrorType } from '../../models/error-type.enum';

@Component({
  selector: 'tndm-review-tooltip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './review-tooltip.scss',
  templateUrl: './review-tooltip.html',
})
export class TndmReviewTooltip {
  readonly errorTypes: ErrorType[] = [
    ErrorType.MemoryLeak,
    ErrorType.Performance,
    ErrorType.BestPractice,
    ErrorType.Security,
  ];
}
