import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TndmPuzzleBoard } from '../puzzle-board/puzzle-board';
import { TndmPuzzleSelect } from '../puzzle-select/puzzle-select';
import { Puzzle } from '../../models/puzzle.model';
import { PUZZLES_DATA } from '../../data/puzzles.data';
@Component({
  selector: 'tndm-type-investigator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TndmPuzzleBoard, TndmPuzzleSelect],
  styleUrl: './type-investigator.scss',
  templateUrl: './type-investigator.html',
})
export class TndmTypeInvestigator {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private solveTimerId: ReturnType<typeof setTimeout> | null = null;

  readonly allPuzzles = signal<Puzzle[]>(PUZZLES_DATA);
  readonly solvedIds = signal<Set<string>>(new Set());

  private readonly puzzleId = toSignal(this.route.paramMap.pipe(map(p => p.get('puzzleId'))));
  readonly activePuzzle = computed(() => {
    const id = this.puzzleId();
    if (!id) {
      return null;
    }
    return this.allPuzzles().find(p => p.id === id) ?? null;
  });

  readonly progressPercent = computed(() => (this.solvedIds().size / this.allPuzzles().length) * 100);

  constructor() {
    this.destroyRef.onDestroy(() => this.clearSolveTimer());
  }

  onPuzzleSelected(puzzle: Puzzle): void {
    this.clearSolveTimer();
    this.router.navigate([puzzle.id], { relativeTo: this.route });
  }

  onPuzzleSolved(): void {
    const puzzle = this.activePuzzle();
    if (!puzzle) {
      return;
    }
    this.solvedIds.update(ids => new Set([...ids, puzzle.id]));
    this.clearSolveTimer();
    const puzzleId = puzzle.id;
    this.solveTimerId = setTimeout(() => {
      if (this.activePuzzle()?.id === puzzleId) {
        this.router.navigate(['..'], { relativeTo: this.route });
      }
    }, 2000);
  }

  onBack(): void {
    this.clearSolveTimer();
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  private clearSolveTimer(): void {
    if (this.solveTimerId !== null) {
      clearTimeout(this.solveTimerId);
      this.solveTimerId = null;
    }
  }
}
