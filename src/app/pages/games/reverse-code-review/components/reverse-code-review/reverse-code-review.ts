import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TndmCaseSidebar } from '../case-sidebar/case-sidebar';
import { TndmCodeViewer } from '../code-viewer/code-viewer';
import { ReviewCase } from '../../models/review-case.model';
import { REVIEW_CASES_DATA } from '../../data/review-cases.data';

@Component({
  selector: 'tndm-reverse-code-review',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TndmCaseSidebar, TndmCodeViewer],
  templateUrl: './reverse-code-review.html',
  styleUrl: './reverse-code-review.scss',
})
export class TndmReverseCode {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly completedIds = signal<Set<string>>(new Set());

  readonly lastScore = signal(0);

  readonly allCases = signal<ReviewCase[]>(REVIEW_CASES_DATA);

  private readonly caseId = toSignal(this.route.paramMap.pipe(map(p => p.get('caseId'))));

  readonly activeCase = computed(() => {
    const id = this.caseId();
    if (!id) {
      return null;
    }
    return this.allCases().find(c => c.id === id) ?? null;
  });

  // readonly showModal = signal(false);

  // readonly maxScore = computed(() => {
  //   const active = this.activeCase();
  //   if (!active) {
  //     return 0;
  //   }
  //   return active.expectedErrors.reduce((sum, e) => sum + e.points, 0);
  // });

  onCaseSelected(reviewCase: ReviewCase): void {
    const hasCase = !!this.caseId();
    this.router.navigate(hasCase ? ['..', reviewCase.id] : [reviewCase.id], { relativeTo: this.route });
  }

  onCaseSolved(score: number): void {
    const active = this.activeCase();
    if (!active) {
      return;
    }

    this.lastScore.set(score);

    this.completedIds.update(ids => {
      const next = new Set(ids);
      next.add(active.id);
      return next;
    });
  }
}
