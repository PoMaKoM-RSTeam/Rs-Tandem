import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'tndm-circle-progress',
  standalone: true,
  imports: [],
  templateUrl: './tndm-circle-progress.html',
  styleUrl: './tndm-circle-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCircleProgress {
  readonly current = input<number>(0);
  readonly max = input<number>(100);
  readonly size = input<number>(90);
  readonly strokeWidth = input<number>(15);
  readonly label = input<string | number>(0);

  private readonly center = 50;

  readonly radius = computed(() => {
    const r = this.center - this.strokeWidth() / 2;
    return r > 0 ? r : 0;
  });

  readonly circumference = computed(() => 2 * Math.PI * this.radius());

  readonly dashOffset = computed(() => {
    const total = this.circumference();
    const progress = Math.max(0, Math.min(1, this.current() / (this.max() || 1)));
    return total * (1 - progress);
  });
}
