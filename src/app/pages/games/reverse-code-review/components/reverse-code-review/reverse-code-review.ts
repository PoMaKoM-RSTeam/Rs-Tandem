import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ReviewCase } from '../../models/review-case.model';
import { REVIEW_CASES_DATA } from '../../data/review-cases.data';

@Component({
  selector: 'tndm-reverse-code-review',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reverse-code-review.html',
  styleUrl: './reverse-code-review.scss',
})
export class TndmReverseCode {
  readonly allCases = signal<ReviewCase[]>(REVIEW_CASES_DATA);
  readonly activeCase = signal<ReviewCase | null>(null);
}
