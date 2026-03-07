import { DropSlot } from './puzzle.model';

export type BoardState = {
  slots: Record<string, DropSlot>;
  paletteBlockIds: string[];
};
