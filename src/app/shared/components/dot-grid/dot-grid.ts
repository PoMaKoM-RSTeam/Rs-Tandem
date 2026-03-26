import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  HostListener,
  Signal,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { TndmDot } from '../dot/tndm-dot.component';
import { TndmLogo } from '../logo/tndm-logo.component';

export type Dot = { x: number; y: number };

export type DotGridData = {
  dots: Dot[];
  rows: number;
  cols: number;
};

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-dot-grid',
  templateUrl: './dot-grid.html',
  styleUrls: ['./dot-grid.scss'],
  imports: [TndmDot, TndmLogo],
})
export class DotGrid implements AfterViewInit {
  readonly dotsRef: Signal<ElementRef<HTMLDivElement> | undefined> = viewChild<ElementRef<HTMLDivElement>>('dots');

  readonly dotDiameter = 29.17;
  readonly dotRadius = this.dotDiameter / 2;

  readonly gapX = 16.67;
  readonly gapY = 10.52;

  readonly stepX = this.dotDiameter + this.gapX;
  readonly stepY = this.dotDiameter + this.gapY;

  readonly offset = 22.92;

  private readonly containerWidth: WritableSignal<number> = signal(0);
  private readonly containerHeight: WritableSignal<number> = signal(0);

  readonly logoX: Signal<number> = computed((): number => this.logoDot().x - this.dotRadius);
  readonly logoY: Signal<number> = computed((): number => this.logoDot().y + this.dotRadius);

  @HostListener('window:resize')
  onResize(): void {
    this.calculateContainerSize();
  }

  readonly logoDot: Signal<Dot> = computed((): Dot => {
    const { dots, rows, cols } = this.gridData();

    if (!dots.length || !rows || !cols) {
      return { x: 0, y: 0 };
    }

    const anchorRow: number = Math.floor(rows / 2);
    const anchorCol: number = Math.floor(cols / 2);

    const index: number = anchorRow * cols + anchorCol;
    return dots[index] ?? null;
  });

  readonly gridData: Signal<DotGridData> = computed((): DotGridData => {
    const width: number = this.containerWidth();
    const height: number = this.containerHeight();

    if (!width || !height) {
      return { dots: [], rows: 0, cols: 0 };
    }

    const { rows, cols } = this.computeGridSize(width, height);

    const gridHeight = this.dotDiameter + (rows - 1) * this.stepY;
    const startTop = (height - gridHeight) / 2;

    const dots = this.generateDots(width, height, rows, cols, startTop);

    return { dots, rows, cols };
  });

  get gridDots(): Dot[] {
    return this.gridData().dots;
  }

  constructor() {
    effect((): void => {
      this.calculateContainerSize();
    });
  }

  ngAfterViewInit(): void {
    this.calculateContainerSize();
  }

  private computeGridSize(width: number, height: number): { rows: number; cols: number } {
    const startX = this.offset + this.dotRadius;

    const cols = Math.floor((width - this.offset - this.dotRadius - startX) / this.stepX) + 1;

    const usableHeight = height - 2 * this.offset;
    const rows = usableHeight <= this.dotDiameter ? 0 : Math.floor((usableHeight - this.dotDiameter) / this.stepY) + 1;

    return { rows, cols };
  }

  private generateDots(width: number, height: number, rows: number, cols: number, startTop: number): Dot[] {
    const dots: Dot[] = [];

    const startLeft = this.offset;

    for (let row = 0; row < rows; row++) {
      const top = startTop + row * this.stepY;
      const rowOffsetLeft = row % 2 === 0 ? 0 : this.stepX / 2;

      for (let col = 0; col < cols; col++) {
        const left = startLeft + rowOffsetLeft + col * this.stepX;

        if (left < 0 || left + this.dotDiameter > width || top < 0 || top + this.dotDiameter > height) {
          continue;
        }

        dots.push({ x: left - this.dotRadius, y: top - this.dotRadius });
      }
    }

    return dots;
  }

  private calculateContainerSize(): void {
    const el: HTMLDivElement | undefined = this.dotsRef()?.nativeElement;
    if (!el) {
      return;
    }

    const { width, height } = el.getBoundingClientRect();
    this.containerWidth.set(width);
    this.containerHeight.set(height);
  }
}
