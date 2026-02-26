import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GolfRank } from '../../types/golf-rank';
import { GOLF_RANKS } from '../../data/data';
import { REGEX_RULES } from '../../types/regex-pattern';
import { TndmCodeGolfEditor } from '../code-golf-editor/code-golf-editor';
import { TndmCodeGolfRank } from '../code-golf-rank/code-golf-rank';
import { TndmButtonComponent } from '../../../../../shared/ui/tndm-button-component/tndm-button-component';

@Component({
  selector: 'tndm-code-golf',
  imports: [FormsModule, TndmCodeGolfEditor, TndmCodeGolfRank, TndmButtonComponent],
  templateUrl: 'code-golf.html',
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
