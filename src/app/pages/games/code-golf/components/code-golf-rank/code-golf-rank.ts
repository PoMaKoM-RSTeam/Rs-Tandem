import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GolfRank } from '../../types/golf-rank';

@Component({
  selector: 'tndm-code-golf-rank',
  standalone: true,
  templateUrl: 'code-golf-rank.html',
  styleUrl: './code-golf-rank.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeGolfRank {
  readonly rank = input.required<GolfRank>();
  readonly byteCount = input.required<number>();
}
