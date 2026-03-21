import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tndm-mistakes-counter',
  imports: [],
  templateUrl: './mistakes-counter.html',
  styleUrl: './mistakes-counter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmMistakesCounter {
  readonly mistakes = input.required<number>();
}
