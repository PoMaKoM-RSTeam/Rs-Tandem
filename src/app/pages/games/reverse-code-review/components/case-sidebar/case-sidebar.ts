import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReviewCase } from '../../models/review-case.model';

@Component({
  selector: 'tndm-case-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './case-sidebar.html',
  styleUrl: './case-sidebar.scss',
})
export class TndmCaseSidebar {
  readonly cases = input.required<ReviewCase[]>();
  readonly activeCaseId = input.required<string | null>();
  readonly caseSelected = output<ReviewCase>();
}
