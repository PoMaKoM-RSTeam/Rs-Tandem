import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'tndm-move-counter',
  imports: [],
  templateUrl: './move-counter.html',
  styleUrl: './move-counter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmMoveCounter {
  readonly moves = input.required<number>();
}
