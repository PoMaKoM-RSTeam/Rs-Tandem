import { BoardState } from '../../models/board.state.model';

export function applyPaletteDrop(state: BoardState, blockId: string, fromSlot: string | null): BoardState {
  if (!fromSlot) {
    return state;
  }

  const slots = { ...state.slots };
  slots[fromSlot] = { ...slots[fromSlot], currentBlockId: null, validationState: 'idle' };
  return { slots, paletteBlockIds: [...state.paletteBlockIds, blockId] };
}
