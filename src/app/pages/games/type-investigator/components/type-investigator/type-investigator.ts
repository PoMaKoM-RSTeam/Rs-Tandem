import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TndmPuzzleBoard } from '../puzzle-board/puzzle-board';
import { TndmPuzzleSelect } from '../puzzle-select/puzzle-select';
import { Puzzle } from '../../models/puzzle.model';
import { PUZZLES_DATA } from '../../data/puzzles.data';

@Component({
  selector: 'tndm-type-investigator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TndmPuzzleBoard, TndmPuzzleSelect],
  styleUrl: './type-investigator.scss',
  template: `
    <div class="ti-page">
      <header class="ti-header">
        <h1 class="ti-title"><span class="ti-title__accent">Type</span> Investigator</h1>
        <p class="ti-subtitle">Puzzles, but with TypeScript.</p>
      </header>

      @if (!activePuzzle()) {
        <tndm-puzzle-select [puzzles]="allPuzzles()" (puzzleSelected)="onPuzzleSelected($event)" />
      } @else {
        <tndm-puzzle-board [puzzle]="activePuzzle()!" (back)="onBack()" (solved)="onPuzzleSolved()" />
      }

      @if (solvedIds().size > 0) {
        <footer class="ti-progress">
          <span class="ti-progress__label"> Solved: {{ solvedIds().size }} / {{ allPuzzles().length }} </span>
          <div class="ti-progress__bar">
            <div class="ti-progress__fill" [style.width.%]="progressPercent()"></div>
          </div>
        </footer>
      }
    </div>
  `,
})
export class TndmTypeInvestigator {
  readonly allPuzzles = signal<Puzzle[]>(PUZZLES_DATA);
  readonly activePuzzle = signal<Puzzle | null>(null);
  readonly solvedIds = signal<Set<string>>(new Set());

  readonly progressPercent = computed(() => (this.solvedIds().size / this.allPuzzles().length) * 100);

  onPuzzleSelected(puzzle: Puzzle): void {
    this.activePuzzle.set(puzzle);
  }

  onPuzzleSolved(): void {
    const puzzle = this.activePuzzle();
    if (!puzzle) {
      return;
    }
    this.solvedIds.update(ids => new Set([...ids, puzzle.id]));
    setTimeout(() => this.activePuzzle.set(null), 2000);
  }

  onBack(): void {
    this.activePuzzle.set(null);
  }
}
