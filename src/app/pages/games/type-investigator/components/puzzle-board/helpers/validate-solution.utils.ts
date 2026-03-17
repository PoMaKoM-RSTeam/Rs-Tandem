import { DropSlot, ValidationState } from '../../../models/puzzle.model';

export type ValidationResult = {
  slots: Record<string, DropSlot>;
  allCorrect: boolean;
};

export function validateSolution(slots: Record<string, DropSlot>): ValidationResult {
  const validated: Record<string, DropSlot> = {};
  let allCorrect = true;

  for (const [id, slot] of Object.entries(slots)) {
    const correct = slot.currentBlockId !== null && slot.acceptedBlockIds.includes(slot.currentBlockId);
    validated[id] = { ...slot, validationState: (correct ? 'correct' : 'wrong') as ValidationState };
    if (!correct) {
      allCorrect = false;
    }
  }

  return { slots: validated, allCorrect };
}
