import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';

import { TndmCodeGolfEditor } from '../code-golf-editor/code-golf-editor';
import { TndmCodeGolfRank } from '../code-golf-rank/code-golf-rank';
import { TndmButton } from '../../../../../shared/ui/tndm-button/tndm-button';

import { TndmCodeGolfResults } from '../results-modal/results-modal';

import { CodeGolfService } from '../../services/code-golf.service';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tndm-code-golf',
  standalone: true,
  imports: [TndmCodeGolfEditor, TndmCodeGolfRank, TndmButton, TndmCodeGolfResults, TranslocoPipe],
  templateUrl: 'code-golf.html',
  styleUrl: './code-golf.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeGolf {
  private readonly translocoService = inject(TranslocoService);
  protected readonly service = inject(CodeGolfService);

  protected readonly byteCount = this.service.byteCount;
  protected readonly previousBest = this.service.previousBest;
  protected readonly currentRank = this.service.currentRank;
  protected readonly currentChallenge = this.service.currentChallenge;
  protected readonly isChallengeLoading = this.service.challengeResource.isLoading;
  protected readonly showResults = this.service.showResults;
  protected readonly result = this.service.result;

  protected get rawCode(): string {
    return this.service.rawCode();
  }
  protected set rawCode(value: string) {
    this.service.rawCode.set(value);
  }

  private readonly translatedCheckLabel = toSignal(this.translocoService.selectTranslate('golf.check'));

  protected readonly checkBtnConfig = computed(() => ({
    label: this.translatedCheckLabel() ?? 'Check Solution',
    isDisabled: this.service.rawCode().trim().length === 0,
  }));

  protected readonly nextBtnConfig = { label: 'Next Challenge' };

  protected checkSolution(): void {
    this.service.checkSolution();
  }

  protected nextChallenge(): void {
    this.service.nextChallenge();
  }

  protected closeModal(): void {
    this.service.showResults.set(false);
  }
}
