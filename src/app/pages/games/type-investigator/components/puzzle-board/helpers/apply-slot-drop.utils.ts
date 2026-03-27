import { BoardState } from '../../../models/board.state.model';

export function applySlotDrop(
  state: BoardState,
  targetSlotId: string,
  blockId: string,
  fromSlot: string | null
): BoardState {
  const slots = { ...state.slots };
  let paletteBlockIds = [...state.paletteBlockIds];

  const targetSlot = slots[targetSlotId];
  if (targetSlot.currentBlockId) {
    paletteBlockIds = [...paletteBlockIds, targetSlot.currentBlockId];
  }

  if (fromSlot) {
    slots[fromSlot] = { ...slots[fromSlot], currentBlockId: null, validationState: 'idle' };
  } else {
    paletteBlockIds = paletteBlockIds.filter(id => id !== blockId);
  }

  slots[targetSlotId] = { ...targetSlot, currentBlockId: blockId, validationState: 'idle' };
  return { slots, paletteBlockIds, blockMap: state.blockMap };
}
