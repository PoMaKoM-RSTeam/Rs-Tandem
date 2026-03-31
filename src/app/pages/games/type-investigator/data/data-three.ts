import { Puzzle } from '../models/puzzle.model';
import { PuzzleDifficulty } from '../models/puzzle-difficulty.enum';

export const DATA_THREE: Puzzle[] = [
  {
    id: 'hard-readonly-partial',
    difficulty: PuzzleDifficulty.Hard,
    title: 'typeInvestigator.hardReadonlyPartial.title',
    description: 'typeInvestigator.hardReadonlyPartial.description',
    hintText: 'typeInvestigator.hardReadonlyPartial.hint',
    availableBlocks: [
      { id: 'one', label: 'T', type: 'identifier' },
      { id: 'two', label: 'K', type: 'identifier' },
      { id: 'three', label: 'K', type: 'identifier' },
      { id: 'four', label: 'readonly', type: 'keyword' },
      { id: 'five', label: '?', type: 'operator' },
      { id: 'six', label: 'extends', type: 'keyword' },
      { id: 'seven', label: 'never', type: 'keyword' },
    ],
    lines: [
      {
        indent: 0,
        segments: [
          { kind: 'locked', text: 'type', tokenType: 'keyword' },
          { kind: 'locked', text: ' ReadonlyPartial', tokenType: 'identifier' },
          { kind: 'locked', text: '<', tokenType: 'bracket' },
          { kind: 'slot', slotId: 's1' },
          { kind: 'locked', text: '>', tokenType: 'bracket' },
          { kind: 'locked', text: ' =', tokenType: 'operator' },
          { kind: 'locked', text: ' {', tokenType: 'bracket' },
        ],
      },
      {
        indent: 1,
        segments: [
          { kind: 'slot', slotId: 's2' },
          { kind: 'locked', text: ' [', tokenType: 'bracket' },
          { kind: 'slot', slotId: 's3' },
          { kind: 'locked', text: ' in keyof T]', tokenType: 'keyword' },
          { kind: 'slot', slotId: 's4' },
          { kind: 'locked', text: ':', tokenType: 'operator' },
          { kind: 'locked', text: ' T[', tokenType: 'identifier' },
          { kind: 'slot', slotId: 's5' },
          { kind: 'locked', text: ']', tokenType: 'bracket' },
        ],
      },
      {
        indent: 0,
        segments: [{ kind: 'locked', text: '}', tokenType: 'bracket' }],
      },
    ],
    slots: {
      s1: {
        id: 's1',
        acceptedBlockIds: ['one'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s2: {
        id: 's2',
        acceptedBlockIds: ['four'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s3: {
        id: 's3',
        acceptedBlockIds: ['two', 'three'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s4: {
        id: 's4',
        acceptedBlockIds: ['five'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s5: {
        id: 's5',
        acceptedBlockIds: ['two', 'three'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
    },
  },
  //TODO - add more puzzles. I've added these for demonstrative purposes.
];
