import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tndm-moves-counter',
  imports: [],
  templateUrl: './moves-counter.html',
  styleUrl: './moves-counter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmMovesCounter {
  readonly moves = input.required<number>();
  readonly movesBeforeFirstMistake = input.required<number>();
}
