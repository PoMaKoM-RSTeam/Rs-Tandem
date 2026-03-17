import { Puzzle } from '../../models/puzzle.model';
import { PuzzleDifficulty } from '../../models/puzzle-difficulty.enum';
import { buildInitialState } from './build-initial-state.utils';
import { getBlock } from './get-block.utils';
import { validateSolution } from './validate-solution.utils';

const mockPuzzle: Puzzle = {
  id: 'test1',
  difficulty: PuzzleDifficulty.Easy,
  title: 'Test',
  description: '',
  hintText: '',
  lines: [],
  availableBlocks: [
    { id: 'b1', label: 'const', type: 'keyword' },
    { id: 'b2', label: 'T', type: 'identifier' },
  ],
  slots: {
    s1: { id: 's1', acceptedBlockIds: ['b1'], currentBlockId: null, locked: false, validationState: 'idle' },
    s2: { id: 's2', acceptedBlockIds: ['b2'], currentBlockId: null, locked: false, validationState: 'idle' },
  },
};

describe('buildInitialState', () => {
  it('should put all blocks into palette', () => {
    const state = buildInitialState(mockPuzzle);
    expect(state.paletteBlockIds).toEqual(['b1', 'b2']);
  });

  it('should reset all slots to empty and idle', () => {
    const state = buildInitialState(mockPuzzle);
    for (const slot of Object.values(state.slots)) {
      expect(slot.validationState).toBe('idle');
    }
  });
});

describe('getBlock', () => {
  it('should return the first block by id', () => {
    const block = getBlock(mockPuzzle, 'b1');
    expect(block?.label).toBe('const');
  });
  it('should return undefined when id is unexist', () => {
    expect(getBlock(mockPuzzle, 'test')).toBeUndefined();
  });
});

describe('validateSolution', () => {
  it('should mark all slots are correct. result.allCorrect should be true.', () => {
    const slots = {
      s1: { id: 's1', acceptedBlockIds: ['b1'], currentBlockId: 'b1', locked: false, validationState: 'idle' as const },
      s2: { id: 's2', acceptedBlockIds: ['b2'], currentBlockId: 'b2', locked: false, validationState: 'idle' as const },
    };
    const result = validateSolution(slots);
    expect(result.allCorrect).toBe(true);
    expect(result.slots['s1'].validationState).toBe('correct');
    expect(result.slots['s2'].validationState).toBe('correct');
  });

  it('should mark wrong slot. result.allCorrect should be false when there is one or more errors.', () => {
    const slots = {
      s1: { id: 's1', acceptedBlockIds: ['b1'], currentBlockId: 'b2', locked: false, validationState: 'idle' as const },
      s2: { id: 's2', acceptedBlockIds: ['b2'], currentBlockId: 'b2', locked: false, validationState: 'idle' as const },
    };

    const result = validateSolution(slots);

    expect(result.allCorrect).toBe(false);
    expect(result.slots['s1'].validationState).toBe('wrong');
    expect(result.slots['s2'].validationState).toBe('correct');
  });
});
