import { Puzzle } from '../models/puzzle.model';
import { PuzzleDifficulty } from '../models/puzzle-difficulty.enum';

export const PUZZLES_DATA: Puzzle[] = [
  {
    id: 'easy-readonly',
    difficulty: PuzzleDifficulty.Easy,
    title: 'easy-readonly', // TODO transloco
    description: 'Make T readonly. So, make mapped type readonly.', // TODO transloco
    hintText: 'Mapped type: [K in keyof T]. Set modifiers, such as infer, before brackets. .', // TODO transloco
    availableBlocks: [
      { id: 'b-readonly', label: 'readonly', type: 'keyword' },
      { id: 'b-K1', label: 'K', type: 'identifier' },
      { id: 'b-K2', label: 'K', type: 'identifier' },
      { id: 'b-T', label: 'T', type: 'identifier' },
      { id: 'b-extends', label: 'extends', type: 'keyword' },
      { id: 'b-infer', label: 'infer', type: 'keyword' },
    ],
    lines: [
      {
        indent: 0,
        segments: [
          { kind: 'locked', text: 'type', tokenType: 'keyword' },
          { kind: 'locked', text: ' MyReadonly', tokenType: 'identifier' },
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
          { kind: 'locked', text: ':', tokenType: 'operator' },
          { kind: 'locked', text: ' T[', tokenType: 'identifier' },
          { kind: 'slot', slotId: 's4' },
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
        acceptedBlockIds: ['b-T'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s2: {
        id: 's2',
        acceptedBlockIds: ['b-readonly'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s3: {
        id: 's3',
        acceptedBlockIds: ['b-K1', 'b-K2'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s4: {
        id: 's4',
        acceptedBlockIds: ['b-K1', 'b-K2'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
    },
  },
  //TODO - add more puzzles.
];
