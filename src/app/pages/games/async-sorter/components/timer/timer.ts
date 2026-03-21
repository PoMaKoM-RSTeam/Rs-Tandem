import { ChangeDetectionStrategy, Component, computed, OnDestroy, signal } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'tndm-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmTimer implements OnDestroy {
  readonly seconds = signal(0);
  private timerSubscription: Subscription | undefined;
  readonly formatedTime = computed(() => {
    const s = this.seconds();
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  constructor() {
    this.start();
  }

  start(): void {
    if (this.timerSubscription) {
      return;
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      this.seconds.update(seconds => seconds + 1);
    });
  }

  stop(): void {
    this.timerSubscription?.unsubscribe();
    this.timerSubscription = undefined;
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
