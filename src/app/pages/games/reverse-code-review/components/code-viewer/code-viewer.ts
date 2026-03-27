import { ChangeDetectionStrategy, Component, computed, effect, input, signal, ViewEncapsulation } from '@angular/core';
import { ReviewCase } from '../../models/review-case.model';
import { highlightCode } from '../../helpers/highlight-code';
import { LineState } from '../../models/line-state.model';

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
  readonly linesState = signal<LineState[]>([]);
  protected readonly ANIMATION_TIMEOUT = 600;
  protected readonly LINE_SHIFT = 1;
  private readonly linesEffect = effect(() => {
    const reviewCase = this.reviewCase();

    this.linesState.set(
      reviewCase.code.split('\n').map((text, i) => ({
        lineNumber: i + 1,
        text,
        isFound: false,
        isWrongFlash: false,
        foundError: null,
      }))
    );
  });

  onLineClick(lineNumber: number, event: Event): void {
    const el = event.currentTarget;
    if (!(el instanceof HTMLElement)) {
      return;
    }

    const expected = this.reviewCase().expectedErrors.find(e => e.line === lineNumber);

    if (!expected) {
      el.classList.add('viewer_line--wrong');
      setTimeout(() => el.classList.remove('viewer_line--wrong'), this.ANIMATION_TIMEOUT);
    } else {
      el.classList.add('viewer_line--found');
      setTimeout(() => el.classList.remove('viewer_line--found'), this.ANIMATION_TIMEOUT);
    }
  }
}
