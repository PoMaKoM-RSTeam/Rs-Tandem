import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GolfRank } from '../../types/golf-rank';
import { REGEX_RULES } from '../../types/regex-pattern';
import { TndmCodeGolfEditor } from '../code-golf-editor/code-golf-editor';
import { TndmCodeGolfRank } from '../code-golf-rank/code-golf-rank';
import { TndmButtonComponent } from '../../../../../shared/ui/tndm-button-component/tndm-button-component';
import { CodeGolfFetcherService } from '../../services/code-golf-fetcher.service';
import { Challenge } from '../../types/challenge';

@Component({
  selector: 'tndm-code-golf',
  standalone: true,
  imports: [TndmCodeGolfEditor, TndmCodeGolfRank, TndmButtonComponent],
  templateUrl: 'code-golf.html',
  styleUrl: './code-golf.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeGolf {
  private readonly fetcherService = inject(CodeGolfFetcherService);

  readonly ranks = signal<GolfRank[]>([]);
  readonly currentChallenge = signal<Challenge | null>(null);
  readonly rawCode = signal('');

  protected readonly checkBtnConfig = { label: 'Check Solution' };
  protected readonly nextBtnConfig = { label: 'Next Challenge' };

  constructor() {
    this.initData();
  }

  readonly byteCount = computed(() => {
    const cleaned = this.rawCode()
      .replace(REGEX_RULES.MultiComment, '')
      .replace(REGEX_RULES.SingleComment, '')
      .replace(REGEX_RULES.AllWhitespace, '');
    return cleaned.length;
  });

  readonly rank = computed((): GolfRank => {
    const bytes = this.byteCount();
    const allRanks = this.ranks();

    return allRanks.find(rank => bytes <= rank.maxBytes) || allRanks[allRanks.length - 1];
  });

  protected async loadRandomChallenge(): Promise<void> {
    try {
      this.currentChallenge.set(null);
      this.rawCode.set('');

      const data = await this.fetcherService.getRandomChallenge();
      if (data) {
        this.currentChallenge.set(data);
      }
    } catch (err) {
      //TODO handle error
      console.error('CodeGolf Error:', err);
    }
  }

  private async initData(): Promise<void> {
    const ranksData = await this.fetcherService.getGolfRanks();
    this.ranks.set(ranksData.sort((a, b) => a.maxBytes - b.maxBytes));
    this.loadRandomChallenge();
  }
}
