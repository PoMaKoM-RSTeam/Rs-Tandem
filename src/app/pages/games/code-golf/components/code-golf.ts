import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GolfRank } from '../types/golf-rank';
import { GOLF_RANKS } from '../data/data';
import { REGEX_RULES } from '../types/regex-pattern';

@Component({
  selector: 'tndm-code-golf',
  imports: [FormsModule],
  template: `
    <div class="game-info">
      <div class="rank-info">
        <span class="icon">{{ rank().icon }}</span>
        <div class="details">
          <div class="label" [style.color]="rank().color">{{ rank().label }}</div>
          <div class="subtext">{{ byteCount() }} Bytes</div>
        </div>
      </div>
      <div class="progress-track">
        <div class="progress-fill" [style.background-color]="rank().color" [style.width.%]="rank().width"></div>
      </div>
    </div>

    <div class="challenge-box">
      <h2 class="challenge-title">Challenge Title</h2>
      <p class="challenge-desc">Challenge description</p>
    </div>

    <textarea
      placeholder="// Write your code here..."
      spellcheck="false"
      [ngModel]="rawCode()"
      (ngModelChange)="rawCode.set($event)">
    </textarea>

    <button class="check-golf" type="button">Check</button>
  `,
  styleUrl: './code-golf.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeGolf {
  readonly rawCode = signal('');

  readonly byteCount = computed(() => {
    const cleaned = this.rawCode()
      .replace(REGEX_RULES.MultiComment, '')
      .replace(REGEX_RULES.SingleComment, '')
      .replace(REGEX_RULES.AllWhitespace, '');
    return new Blob([cleaned]).size;
  });

  readonly rank = computed((): GolfRank => {
    const bytes = this.byteCount();
    return GOLF_RANKS.find(rank => bytes <= (rank.maxBytes ?? Infinity)) ?? GOLF_RANKS[GOLF_RANKS.length - 1];
  });
}
