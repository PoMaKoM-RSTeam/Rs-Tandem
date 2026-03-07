import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GolfRank } from '../../types/golf-rank';
import { GOLF_RANKS } from '../../data/data';
import { REGEX_RULES } from '../../types/regex-pattern';
import { TndmCodeGolfEditor } from '../code-golf-editor/code-golf-editor';
import { TndmCodeGolfRank } from '../code-golf-rank/code-golf-rank';
import { TndmButton } from '../../../../../shared/ui/tndm-button/tndm-button';

@Component({
  selector: 'tndm-code-golf',
  imports: [FormsModule, TndmCodeGolfEditor, TndmCodeGolfRank, TndmButton],
  template: `
    <tndm-code-golf-rank [byteCount]="byteCount()" [rank]="rank()" />

    <div class="challenge-wrapper">
      <h2 class="challenge-title">Challenge Title</h2>
      <p class="challenge-description">Challenge description</p>
    </div>

    <tndm-code-golf-editor [(value)]="rawCode" />

    <div class="controls">
      <tndm-button [btnConfig]="{ label: 'Check Solution' }" />
      <tndm-button [btnConfig]="{ label: 'Next Challenge' }" />
    </div>
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
