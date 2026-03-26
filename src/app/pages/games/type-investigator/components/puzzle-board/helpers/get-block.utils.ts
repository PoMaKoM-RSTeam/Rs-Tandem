import { CodeBlock, Puzzle } from '../../../models/puzzle.model';

export function getBlock(puzzle: Puzzle, id: string | null): CodeBlock | undefined {
  if (!id) {
    return undefined;
  }
  return puzzle.availableBlocks.find(b => b.id === id);
}
