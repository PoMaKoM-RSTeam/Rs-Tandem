import { computed, inject, Injectable, resource, signal } from '@angular/core';
import { PuzzleCompletionRow, TypeInvestigatorFetcherService } from './type-investigator-fetcher.service';
import { TndmAuthStateStoreService } from '@auth';
import { ToastService } from '../../../../core/toast/toast-service';
import { PuzzleDifficulty } from '../models/puzzle-difficulty.enum';
import { TranslocoService } from '@jsverse/transloco';

@Injectable({ providedIn: 'root' })
export class TypeInvestigatorService {
  private readonly fetcher = inject(TypeInvestigatorFetcherService);
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
        return await this.fetcher.getCompletedPuzzles(uid);
      } catch (err) {
        this.toastService.danger(
          this.translocoService.translate('ti-rcr-fetchers.error'),
          this.translocoService.translate('ti-rcr-fetchers.progress')
        );
        throw err;
      }
    },
    defaultValue: [] as PuzzleCompletionRow[],
  });

  private readonly pendingCompletions = signal<PuzzleCompletionRow[]>([]);

  readonly completions = computed<PuzzleCompletionRow[]>(() => [
    ...this.completionsResource.value(),
    ...this.pendingCompletions(),
  ]);

  readonly completedIds = computed(() => new Set(this.completions().map(c => c.puzzle_id)));

  async savePuzzleCompletion(puzzleId: string, difficulty: PuzzleDifficulty): Promise<void> {
    const uid = this.userId();
    if (!uid) {
      this.toastService.warning(
        this.translocoService.translate('ti-rcr-fetchers.auth'),
        this.translocoService.translate('ti-rcr-fetchers.authText')
      );
      return;
    }

    if (this.completionsResource.error()) {
      this.toastService.danger(
        this.translocoService.translate('ti-rcr-fetchers.error'),
        this.translocoService.translate('ti-rcr-fetchers.progress')
      );
      return;
    }

    if (this.completedIds().has(puzzleId)) {
      return;
    }

    try {
      await this.fetcher.savePuzzleCompletion(uid, puzzleId, difficulty);
      this.pendingCompletions.update(rows => [
        ...rows,
        { puzzle_id: puzzleId, difficulty, solved_at: new Date().toISOString() },
      ]);
      this.toastService.success(
        this.translocoService.translate('ti-rcr-fetchers.saved'),
        this.translocoService.translate('ti-rcr-fetchers.savedText')
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'ti-rcr-fetchers.progress';
      this.toastService.danger(this.translocoService.translate('ti-rcr-fetchers.fail'), message);
    }
  }
}
