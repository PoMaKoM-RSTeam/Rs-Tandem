import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GolfRank } from '../../types/golf-rank';
import { REGEX_RULES } from '../../types/regex-pattern';
import { TndmCodeGolfEditor } from '../code-golf-editor/code-golf-editor';
import { TndmCodeGolfRank } from '../code-golf-rank/code-golf-rank';
import { TndmButton } from '../../../../../shared/ui/tndm-button/tndm-button';
import { CodeGolfFetcherService } from '../../services/code-golf-fetcher.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tndm-code-golf',
  standalone: true,
  imports: [TndmCodeGolfEditor, TndmCodeGolfRank, TndmButton],
  templateUrl: 'code-golf.html',
  styleUrl: './code-golf.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeGolf {
  private readonly fetcherService = inject(CodeGolfFetcherService);

  readonly ranksResource = rxResource({
    stream: () => this.fetcherService.getGolfRanks(),
  });
  readonly challengeResource = rxResource({
    stream: () => this.fetcherService.getRandomChallenge(),
  });

  readonly rawCode = signal('');

  readonly currentChallenge = computed(() => this.challengeResource.value());

  protected readonly checkBtnConfig = { label: 'Check Solution' };
  protected readonly nextBtnConfig = { label: 'Next Challenge' };

  readonly byteCount = computed(() => {
    const code = this.rawCode();
    if (!code) {
      return 0;
    }
    return code
      .replace(REGEX_RULES.MultiComment, '')
      .replace(REGEX_RULES.SingleComment, '')
      .replace(REGEX_RULES.AllWhitespace, '').length;
  });

  readonly currentRank = computed((): GolfRank => {
    const bytes = this.byteCount();
    const allRanks = this.ranksResource.value() ?? [];
    return allRanks.find(rank => bytes <= rank.maxBytes) || allRanks[allRanks.length - 1];
  });

  protected async nextChallenge(): Promise<void> {
    this.rawCode.set('');
    this.challengeResource.reload();
  }
}
