import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { ExpectedError, ReviewCase } from '../../models/review-case.model';
import { highlightCode } from '../../helpers/highlight-code';
import { LineState } from '../../models/line-state.model';
import { ErrorType } from '../../models/error-type.enum';
import { TndmReviewTooltip } from '../review-tooltip/review-tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'tndm-code-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: { class: 'code-viewer' },
  imports: [TndmReviewTooltip, TranslocoPipe],
  templateUrl: './code-viewer.html',
  styleUrl: './code-viewer.scss',
})
export class TndmCodeViewer {
  protected readonly ANIMATION_TIMEOUT = 600;
  protected readonly LINE_SHIFT = 1;

  readonly reviewCase = input.required<ReviewCase>();
  readonly solved = output<number>();
  readonly highlightedLines = computed(() => highlightCode(this.reviewCase().code));

  readonly linesState = signal<LineState[]>([]);
  readonly tooltipLine = signal<number | null>(null);
  readonly wrongType = signal(false);
  readonly tooltipTop = signal(0);
  readonly score = signal(0);

  readonly foundCount = computed(() => this.linesState().filter(l => l.isFound).length);
  readonly totalErrors = computed(() => this.reviewCase().expectedErrors.length);

  private readonly linesEffect = effect(() => {
    const reviewCase = this.reviewCase();
    this.linesState.set(
      reviewCase.code.split('\n').map((text, i) => ({
        lineNumber: i + this.LINE_SHIFT, //  in this case - index shift
        text,
        isFound: false,
        isWrongFlash: false,
        foundError: null,
      }))
    );
    this.closeTooltip();
    this.score.set(0);
  });

  onLineClick(lineNumber: number, event: Event): void {
    const el = event.currentTarget;
    const expected = this.findExpectedError(lineNumber);

    if (!(el instanceof HTMLElement)) {
      return;
    }

    if (!expected) {
      el.classList.add('viewer_line--wrong');
      setTimeout(() => el.classList.remove('viewer_line--wrong'), this.ANIMATION_TIMEOUT);
      this.closeTooltip();
      return;
    }
    const alreadyFound = this.linesState().find(l => l.lineNumber === lineNumber)?.isFound;
    if (alreadyFound) {
      return;
    }

    const editor = el.closest('.viewer_editor');
    if (editor instanceof HTMLElement) {
      const top = el.offsetTop - editor.offsetTop + el.offsetHeight;
      this.tooltipTop.set(top);
    }

    this.tooltipLine.set(lineNumber);
  }

  onTypeSelected(type: ErrorType): void {
    const lineNumber = this.tooltipLine();
    if (lineNumber === null) {
      return;
    }

    const expected = this.findExpectedError(lineNumber);
    if (!expected) {
      return;
    }

    if (type !== expected.type) {
      this.wrongType.set(true);
      return;
    }

    this.markCorrect(lineNumber, expected);
    this.closeTooltip();

    if (this.foundCount() === this.totalErrors()) {
      this.solved.emit(this.score());
    }
  }

  closeTooltip(): void {
    this.tooltipLine.set(null);
    this.wrongType.set(false);
  }

  private findExpectedError(lineNumber: number): ExpectedError | undefined {
    return this.reviewCase().expectedErrors.find(e => e.line === lineNumber);
  }

  private markCorrect(lineNumber: number, error: ExpectedError): void {
    this.score.update(s => s + error.points);
    this.linesState.update(lines =>
      lines.map(l => (l.lineNumber === lineNumber ? { ...l, isFound: true, foundError: error } : l))
    );
  }
}
