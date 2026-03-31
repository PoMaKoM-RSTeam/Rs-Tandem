import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
@Component({
  selector: 'tndm-mistakes-counter',
  imports: [TranslocoPipe],
  templateUrl: './mistakes-counter.html',
  styleUrl: './mistakes-counter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmMistakesCounter {
  readonly mistakes = input.required<number>();
}
