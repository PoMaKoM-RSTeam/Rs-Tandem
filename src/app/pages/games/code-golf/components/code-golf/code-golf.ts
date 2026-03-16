import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { GolfRank } from '../../types/golf-rank';
import { REGEX_RULES } from '../../types/regex-pattern';
import { TndmCodeGolfEditor } from '../code-golf-editor/code-golf-editor';
import { TndmCodeGolfRank } from '../code-golf-rank/code-golf-rank';
import { TndmButton } from '../../../../../shared/ui/tndm-button/tndm-button';
import { CodeGolfFetcherService } from '../../services/code-golf-fetcher.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { CodeValidatorService } from '../../services/code-validator.service';

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
  private readonly validatorService = inject(CodeValidatorService);

  readonly isChecking = this.validatorService.isChecking;
  readonly lastResult = this.validatorService.lastResult;

  protected checkSolution(): void {
    const code = this.rawCode();
    const challenge = this.currentChallenge();

    if (code && challenge) {
      this.validatorService.check(code, {
        input: [
          [3, 2],
          [5, 6],
        ],
      });
    }
  }
  /*
  protected checkSolution(): void {
    const code = this.rawCode();
    const challenge = this.currentChallenge();

    if (this.worker && code && challenge) {
      this.isChecking.set(true);

      this.worker.postMessage({
        code,
        testCases: [
          [3, 2],
          [5, 6],
        ],
      });
    }
  }*/

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
