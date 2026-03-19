import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { CdkDrag, CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { CodeBlock, Puzzle } from '../../models/puzzle.model';
import { TndmButton } from '../../../../../shared/ui/tndm-button/tndm-button';
import { BoardState } from '../../models/board.state.model';
import { buildInitialState } from './helpers/build-initial-state.utils';
import { getBlock } from './helpers/get-block.utils';
import { applySlotDrop } from './helpers/apply-slot-drop.utils';
import { applyPaletteDrop } from './helpers/apply-palette-drop.utils';
import { validateSolution } from './helpers/validate-solution.utils';

@Component({
  selector: 'tndm-puzzle-board',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CdkDropListGroup, CdkDropList, CdkDrag, TndmButton],
  styleUrl: './puzzle-board.scss',
  templateUrl: './puzzle-board.html',
})
export class TndmPuzzleBoard {
  readonly puzzle = input.required<Puzzle>();
  readonly solved = output<void>();
  readonly back = output<void>();

  readonly state = signal<BoardState>({ slots: {}, paletteBlockIds: [] });
  readonly showHint = signal(false);
  readonly isSolved = signal(false);

  readonly allSlotsFilled = computed(() => Object.values(this.state().slots).every(s => s.currentBlockId !== null));

  constructor() {
    effect(() => {
      const puzzle = this.puzzle();
      this.state.set(buildInitialState(puzzle));
      this.isSolved.set(false);
      this.showHint.set(false);
    });
  }

  toggleHint(): void {
    this.showHint.update(v => !v);
  }

  resetPuzzle(): void {
    this.state.set(buildInitialState(this.puzzle()));
    this.isSolved.set(false);
  }

  findBlock(id: string | null): CodeBlock | undefined {
    return getBlock(this.puzzle(), id);
  }

  onDrop(event: CdkDragDrop<string>, targetSlotId: string): void {
    const { blockId, fromSlot } = event.item.data as { blockId: string; fromSlot: string | null };
    this.state.update(s => applySlotDrop(s, targetSlotId, blockId, fromSlot));
  }

  onDropToPalette(event: CdkDragDrop<string>): void {
    const { blockId, fromSlot } = event.item.data as { blockId: string; fromSlot: string | null };
    this.state.update(s => applyPaletteDrop(s, blockId, fromSlot));
  }

  checkSolution(): void {
    const result = validateSolution(this.state().slots);
    this.state.update(s => ({ ...s, slots: result.slots }));

    if (result.allCorrect) {
      this.isSolved.set(true);
      this.solved.emit();
    }
  }
}
