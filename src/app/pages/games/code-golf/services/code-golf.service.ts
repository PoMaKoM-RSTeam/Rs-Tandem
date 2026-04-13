import { computed, effect, inject, Injectable, OnDestroy, signal } from '@angular/core';
import { CodeGolfFetcherService } from './code-golf-fetcher.service';
import { TndmAuthStateStoreService } from '@auth';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { REGEX_RULES } from '../types/regex-pattern';
import { GolfRank } from '../types/golf-rank';
import { catchError, combineLatest, delay, distinctUntilChanged, finalize, of, switchMap, tap, throwError } from 'rxjs';
import { ToastService } from '../../../../core/toast/toast-service';
import { WorkerResponse } from '../types/worker.types';
import { Challenge } from '../types/challenge';
import { LanguagePreferenceService } from '../../../../core/i18n/language-preferences.service';
import { LoadingOverlayService } from '../../../../core/loading-overlay/loading-overlay-service';
import { TranslocoService } from '@jsverse/transloco';

@Injectable()
export class CodeGolfService implements OnDestroy {
  private readonly fetcher = inject(CodeGolfFetcherService);
  private readonly authStore = inject(TndmAuthStateStoreService);
  private readonly toastService = inject(ToastService);
  private readonly langService = inject(LanguagePreferenceService);
  private readonly loadingService = inject(LoadingOverlayService);
  protected readonly transloco: TranslocoService = inject(TranslocoService);

  readonly rawCode = signal('');
  readonly showResults = signal(false);
  readonly result = signal<WorkerResponse | null>(null);
  private readonly currentChallengeKey = signal<string | null>(null);
  private readonly isSaving = signal(false);

  readonly byteCount = computed((): number => {
    const code = this.rawCode();
    return code ? this.calculateByteCount(code) : 0;
  });

  readonly userId = computed(() => this.authStore.user()?.id);

  private readonly lang$ = toObservable(this.langService.activeLang);

  private readonly challengeParams$ = combineLatest({
    lang: this.lang$,
    key: toObservable(this.currentChallengeKey),
  });

  readonly challengeResource = rxResource({
    stream: () =>
      this.challengeParams$.pipe(
        switchMap(({ lang, key }) => {
          if (!lang) return of(undefined);
          const langCode = lang as 'ru' | 'en';

          const request$ = !key
            ? this.fetcher.getRandomChallenge(langCode).pipe(
                tap(challenge => {
                  if (challenge) this.currentChallengeKey.set(challenge.challenge_key);
                })
              )
            : this.fetcher.getChallengeById(langCode, key);

          return request$.pipe(
            catchError(err => {
              return throwError(() => err);
            })
          );
        })
      ),
  });

  readonly currentChallenge = computed(() => this.challengeResource.value());

  private readonly userParams$ = toObservable(
    computed(() => ({
      key: this.currentChallenge()?.challenge_key,
      uid: this.userId(),
    }))
  );

  readonly ranksResource = rxResource({
    stream: () =>
      this.fetcher.getGolfRanks().pipe(
        catchError(err => {
          return throwError(() => err);
        })
      ),
  });

  private readonly errorEffect = effect(() => {
    const ranksError = this.ranksResource.error();
    const challengeError = this.challengeResource.error();

    if (ranksError || challengeError) {
      this.toastService.danger(
        this.transloco.translate('golf.commonError'),
        this.transloco.translate('golf.refreshPage')
      );
    }
  });

  readonly previousBestResource = rxResource({
    stream: () =>
      this.userParams$.pipe(
        switchMap(({ key, uid }) => {
          if (!key || !uid) return of(null);
          return this.fetcher.getUserChallengeResult(key, uid).pipe(catchError(() => of(null)));
        })
      ),
  });

  readonly previousBest = computed(() => this.previousBestResource.value() ?? null);

  readonly currentRank = computed((): GolfRank | undefined => {
    const bytes = this.byteCount();
    const allRanks = this.ranksResource.value();
    return allRanks?.length ? this.findRankForBytes(bytes, allRanks) : undefined;
  });

  readonly isGlobalLoading = computed(
    () =>
      this.challengeResource.isLoading() ||
      this.ranksResource.isLoading() ||
      this.previousBestResource.isLoading() ||
      this.isSaving()
  );

  private readonly debouncedLoading = toSignal(
    toObservable(this.isGlobalLoading).pipe(
      switchMap(isLoading => (isLoading ? of(true).pipe(delay(150)) : of(false))),
      distinctUntilChanged()
    ),
    { initialValue: false }
  );

  private readonly syncLoadingEffect = effect(() => {
    if (this.debouncedLoading()) {
      this.loadingService.show();
    } else {
      this.loadingService.hide();
    }
  });

  private worker: Worker | undefined;

  constructor() {
    this.initWorker();
  }

  checkSolution(): void {
    const code = this.rawCode();
    const challenge = this.currentChallenge();
    if (this.validateSolutionInput(code, challenge) && this.worker) {
      this.worker.postMessage({ code, testCases: challenge?.test_cases });
      this.showResults.set(true);
    }
  }

  nextChallenge(): void {
    this.rawCode.set('');
    this.showResults.set(false);
    this.result.set(null);
    this.currentChallengeKey.set(null);
  }

  saveResult(challengeKey: string, userId: string, bytes: number): void {
    const best = this.previousBest();
    if (best !== null && bytes >= best) {
      this.toastService.info(
        this.transloco.translate('golf.keepTrying'),
        this.transloco.translate('golf.currentBest', { best: best })
      );
      return;
    }

    this.isSaving.set(true);
    this.fetcher
      .saveResult(challengeKey, userId, bytes)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: savedBytes => {
          this.toastService.success(
            this.transloco.translate('golf.newRecord'),
            this.transloco.translate('golf.saveSuccess', { bytes: savedBytes })
          );
          this.previousBestResource.reload();
        },
        error: () => {
          this.toastService.danger(
            this.transloco.translate('golf.commonError'),
            this.transloco.translate('golf.refreshPage')
          );
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
      this.toastService.warning(
        this.transloco.translate('golf.emptyCode'),
        this.transloco.translate('golf.emptyCodeMsg')
      );
      return false;
    }
    if (!challenge) {
      this.toastService.danger(
        this.transloco.translate('golf.commonError'),
        this.transloco.translate('golf.noChallenge')
      );
      return false;
    }
    return true;
  }
}
