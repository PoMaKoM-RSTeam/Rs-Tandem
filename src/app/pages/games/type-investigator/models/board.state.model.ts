import { CodeBlock, DropSlot } from './puzzle.model';

export type BoardState = {
  slots: Record<string, DropSlot>;
  paletteBlockIds: string[];
  blockMap: Map<string, CodeBlock>;
};
