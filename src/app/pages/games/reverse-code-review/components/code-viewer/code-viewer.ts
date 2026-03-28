import { ChangeDetectionStrategy, Component, computed, input, ViewEncapsulation } from '@angular/core';
import { ReviewCase } from '../../models/review-case.model';
import { highlightCode } from '../../helpers/highlight-code';

@Component({
  selector: 'tndm-code-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'code-viewer' },
  templateUrl: './code-viewer.html',
  styleUrl: './code-viewer.scss',
})
export class TndmCodeViewer {
  readonly reviewCase = input.required<ReviewCase>();
  readonly highlightedLines = computed(() => highlightCode(this.reviewCase().code));
}
