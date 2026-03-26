import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Puzzle } from '../../models/puzzle.model';
import { PuzzleDifficulty } from '../../models/puzzle-difficulty.enum';

@Component({
  selector: 'tndm-puzzle-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './puzzle-select.scss',
  templateUrl: './puzzle-select.html',
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
