import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { CaseCompletionRow, ReverseCodeReviewFetcherService } from './reverse-code-review-fetcher.service';
import { TndmAuthStateStoreService } from '@auth';
import { ToastService } from '../../../../core/toast/toast-service';
import { CaseDifficulty } from '../models/review-case.model';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class ReverseCodeReviewService {
  private readonly fetcher = inject(ReverseCodeReviewFetcherService);
  private readonly authStore = inject(TndmAuthStateStoreService);
  private readonly toastService = inject(ToastService);
  private readonly translocoService = inject(TranslocoService);

  readonly userId = computed(() => this.authStore.user()?.id ?? null);

  private readonly completionsResource = resource({
    params: () => this.userId(),
    loader: async ({ params: uid }) => {
      if (!uid) {
        return [];
      }
      try {
        return await this.fetcher.getCompletedCases(uid);
      } catch (err) {
        this.toastService.danger(
          this.translocoService.translate('ti-rcr-fetchers.error'),
          this.translocoService.translate('ti-rcr-fetchers.progress')
        );
        throw err;
      }
    },
    defaultValue: [] as CaseCompletionRow[],
  });

  private readonly pendingByCaseId = signal<Map<string, CaseCompletionRow>>(new Map());

  readonly completions = computed<CaseCompletionRow[]>(() => {
    const merged = new Map<string, CaseCompletionRow>();
    for (const row of this.completionsResource.value()) {
      merged.set(row.case_id, row);
    }
    for (const [caseId, row] of this.pendingByCaseId()) {
      merged.set(caseId, row);
    }
    return Array.from(merged.values());
  });

  readonly completedIds = computed(() => new Set(this.completions().map(c => c.case_id)));

  readonly bestScores = computed(() => {
    const map = new Map<string, number>();
    for (const c of this.completions()) {
      map.set(c.case_id, c.score);
    }
    return map;
  });

  async saveCaseCompletion(caseId: string, difficulty: CaseDifficulty, score: number, maxScore: number): Promise<void> {
    const uid = this.userId();
    if (!uid) {
      this.toastService.warning(
        this.translocoService.translate('ti-rcr-fetchers.auth'),
        this.translocoService.translate('ti-rcr-fetchers.authText')
      );
      return;
    }

    if (this.completionsResource.error()) {
      this.toastService.warning(
        this.translocoService.translate('ti-rcr-fetchers.error'),
        this.translocoService.translate('ti-rcr-fetchers.progress')
      );
      return;
    }

    const previousBest = this.bestScores().get(caseId);
    if (previousBest !== undefined && score <= previousBest) {
      return;
    }

    try {
      await this.fetcher.saveCaseCompletion(uid, caseId, difficulty, score, maxScore);
      this.pendingByCaseId.update(current => {
        const next = new Map(current);
        next.set(caseId, {
          case_id: caseId,
          difficulty,
          score,
          max_score: maxScore,
          solved_at: new Date().toISOString(),
        });
        return next;
      });
      this.toastService.success(
        this.translocoService.translate('ti-rcr-fetchers.saved'),
        this.translocoService.translate('ti-rcr-fetchers.savedText')
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : this.translocoService.translate('ti-rcr-fetchers.progress');
      this.toastService.danger(this.translocoService.translate('ti-rcr-fetchers.fail'), message);
    }
  }
}
