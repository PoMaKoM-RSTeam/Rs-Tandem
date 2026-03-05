import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Puzzle } from '../../models/puzzle.model';
import { PuzzleDifficulty } from '../../models/puzzle-difficulty.enum';

@Component({
  selector: 'tndm-puzzle-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="puzzle-select_grid">
      @for (puzzle of puzzles(); track puzzle.id) {
        <button
          class="puzzle-select_card"
          type="button"
          [class]="'puzzle-select_card puzzle-select_card--' + puzzle.difficulty"
          (click)="puzzleSelected.emit(puzzle)">
          <span class="puzzle-select_card__badge">{{ difficultyLabel(puzzle.difficulty) }}</span>
          <span class="puzzle-select_card__title">{{ puzzle.title }}</span>
          <span class="puzzle-select_card__desc">{{ puzzle.description }}</span>
        </button>
      }
    </section>
  `,
  styleUrl: './puzzle-select.scss',
})
export class TndmPuzzleSelect {
  readonly puzzles = input.required<Puzzle[]>();
  readonly puzzleSelected = output<Puzzle>();

  difficultyLabel(d: PuzzleDifficulty): string {
    const labels: Record<PuzzleDifficulty, string> = {
      [PuzzleDifficulty.Easy]: 'Easy',
      [PuzzleDifficulty.Medium]: 'Medium',
      [PuzzleDifficulty.Hard]: 'Hard',
    };
    return labels[d] ?? d;
  }
}
