import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tndm-move-counter',
  imports: [],
  templateUrl: './moves-counter.html',
  styleUrl: './moves-counter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmMoveCounter {
  readonly moves = input.required<number>();
}
