import { DropSlot, Puzzle } from '../../models/puzzle.model';
import { BoardState } from '../../models/board.state.model';

export function buildInitialState(puzzle: Puzzle): BoardState {
  const slots: Record<string, DropSlot> = {};
  for (const [id, slot] of Object.entries(puzzle.slots)) {
    slots[id] = { ...slot, currentBlockId: null, validationState: 'idle' };
  }
  return { slots, paletteBlockIds: puzzle.availableBlocks.map(b => b.id) };
}
