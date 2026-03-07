import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GolfRank } from '../../types/golf-rank';

@Component({
  selector: 'tndm-code-golf-rank',
  standalone: true,
  template: `
    <div class="game-info">
      <div class="rank-info">
        <span class="icon">{{ rank().icon }}</span>
        <div class="details">
          <div class="rank" [style.color]="rank().color">{{ rank().label }}</div>
          <div class="bytes-amount">{{ byteCount() }} Bytes</div>
        </div>
      </div>
      <div class="rank-progress">
        <div class="progress-fill" [style.background-color]="rank().color" [style.width.%]="rank().width"></div>
      </div>
    </div>
  `,
  styleUrl: './code-golf-rank.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeGolfRank {
  readonly rank = input.required<GolfRank>();
  readonly byteCount = input.required<number>();
}
