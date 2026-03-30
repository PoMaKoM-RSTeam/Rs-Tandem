import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReviewCase } from '../../models/review-case.model';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'tndm-case-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TranslocoPipe],
  templateUrl: './case-sidebar.html',
  styleUrl: './case-sidebar.scss',
})
export class TndmCaseSidebar {
  protected readonly INDEX_SHIFT = 1;

  readonly cases = input.required<ReviewCase[]>();
  readonly activeCaseId = input.required<string | null>();
  readonly completedIds = input.required<Set<string>>();
  readonly caseSelected = output<ReviewCase>();
}
