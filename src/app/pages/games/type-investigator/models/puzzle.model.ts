import { PuzzleDifficulty } from './puzzle-difficulty.enum';

export type TokenType = 'keyword' | 'operator' | 'identifier' | 'bracket';
export type ValidationState = 'idle' | 'correct' | 'wrong';

export type CodeBlock = {
  id: string;
  label: string;
  type: TokenType;
};

export type DropSlot = {
  id: string;
  acceptedBlockIds: string[];
  currentBlockId: string | null;
  locked: boolean;
  validationState: ValidationState;
};

export type LockedSegment = {
  kind: 'locked';
  text: string;
  tokenType: TokenType;
};

export type SlotSegment = {
  kind: 'slot';
  slotId: string;
};

export type LineSegment = LockedSegment | SlotSegment;

export type PuzzleLine = {
  indent: number;
  segments: LineSegment[];
};

export type Puzzle = {
  id: string;
  difficulty: PuzzleDifficulty;
  title: string;
  description: string;
  availableBlocks: CodeBlock[];
  lines: PuzzleLine[];
  slots: Record<string, DropSlot>;
  hintText: string;
};

export type PuzzleCompletion = {
  puzzleId: string;
  difficulty: PuzzleDifficulty;
  solvedAt: Date;
};
