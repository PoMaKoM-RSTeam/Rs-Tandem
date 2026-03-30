import { computed, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { CodeGolfFetcherService } from './code-golf-fetcher.service';
import { TndmAuthStateStoreService } from '@auth';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { REGEX_RULES } from '../types/regex-pattern';
import { GolfRank } from '../types/golf-rank';
import { catchError, of, switchMap } from 'rxjs';
import { ToastService } from '../../../../core/toast/toast-service';
import { WorkerResponse } from '../types/worker.types';
import { Challenge } from '../types/challenge';
import { LanguagePreferenceService } from '../../../../core/i18n/language-preferences.service';

@Injectable({ providedIn: 'root' })
export class CodeGolfService implements OnDestroy {
  private readonly fetcher = inject(CodeGolfFetcherService);
  private readonly authStore = inject(TndmAuthStateStoreService);
  private readonly toastService = inject(ToastService);
  private readonly langService = inject(LanguagePreferenceService);

  private worker: Worker | undefined;
  private readonly workerTimeout = 5000;

  readonly rawCode = signal('');
  readonly showResults = signal(false);
  readonly result = signal<WorkerResponse | null>(null);

  readonly ranksResource = rxResource({
    stream: () => this.fetcher.getGolfRanks(),
  });

  readonly challengeResource = rxResource({
    stream: () => this.fetcher.getRandomChallenge(this.langService.activeLang()),
  });

  readonly currentChallenge = computed(() => this.challengeResource.value());
  readonly userId = computed(() => this.authStore.user()?.id);

  readonly byteCount = computed(() => {
    const code = this.rawCode();
    if (!code) {
      return 0;
    }

    return this.calculateByteCount(code);
  });

  readonly currentRank = computed((): GolfRank | undefined => {
    const bytes = this.byteCount();
    const allRanks = this.ranksResource.value();

    if (!allRanks?.length) {
      return undefined;
    }

    return this.findRankForBytes(bytes, allRanks);
  });

  private readonly userResult = toObservable(
    computed(() => ({
      key: this.currentChallenge()?.challenge_key,
      uid: this.userId(),
    }))
  ).pipe(
    switchMap(({ key, uid }) => {
      if (!key || !uid) {
        return of(null);
      }

      return this.fetcher.getUserChallengeResult(key, uid).pipe(
        catchError(error => {
          this.toastService.danger('Save failed', error);
          return of(null);
        })
      );
    })
  );

  readonly previousBest = toSignal(this.userResult, { initialValue: null });

  constructor() {
    this.initWorker();
  }

  checkSolution(): void {
    const code = this.rawCode();
    const challenge = this.currentChallenge();

    if (!this.validateSolutionInput(code, challenge)) {
      return;
    }

    if (code && challenge && this.worker) {
      this.worker.postMessage({ code, testCases: challenge.test_cases });
      this.showResults.set(true);
    }
  }

  nextChallenge(): void {
    this.rawCode.set('');
    this.showResults.set(false);
    this.result.set(null);
    this.challengeResource.reload();
  }

  saveResult(challengeKey: string, userId: string, bytes: number): void {
    const previousBest = this.previousBest();
    const isNewRecord = previousBest === null || bytes < previousBest;

    if (!isNewRecord) {
      this.toastService.info('Keep trying!', `Your current best is ${previousBest} bytes.`);
      return;
    }

    this.fetcher.saveResult(challengeKey, userId, bytes).subscribe({
      next: (savedBytes: number) => {
        this.toastService.success('New Record!', `Result of ${savedBytes} bytes saved successfully.`);
      },
      error: err => {
        const errorMessage = err?.message || 'Unknown database error';
        this.toastService.danger('Save failed', errorMessage);
      },
    });
  }

  private initWorker(): void {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./code-golf.worker', import.meta.url));

      this.worker.onmessage = ({ data }: MessageEvent<WorkerResponse>): void => {
        this.result.set(data);

        const challenge = this.currentChallenge();
        const userId = this.userId();
        if (data.allPassed && challenge && userId) {
          this.saveResult(challenge.challenge_key, userId, this.byteCount());
        }
      };

      this.worker.onerror = (event: ErrorEvent): void => {
        event.preventDefault();
        this.result.set({ allPassed: false, error: `${event.message}` });
      };
    }
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
  }

  private calculateByteCount(code: string): number {
    return code
      .replace(REGEX_RULES.MultiComment, '')
      .replace(REGEX_RULES.SingleComment, '')
      .replace(REGEX_RULES.AllWhitespace, '').length;
  }

  private findRankForBytes(bytes: number, ranks: GolfRank[]): GolfRank {
    return ranks.find(rank => bytes <= rank.maxBytes) ?? ranks[ranks.length - 1];
  }

  private validateSolutionInput(code: string, challenge: Challenge | undefined): boolean {
    if (!code?.trim()) {
      this.toastService.warning('Empty Code', 'Please write some code first!');
      return false;
    }

    if (!challenge) {
      this.toastService.danger('No Challenge', 'Please wait for the challenge to load.');
      return false;
    }
    return true;
  }
}
