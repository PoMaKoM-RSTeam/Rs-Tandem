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
      { id: 'one', label: 'readonly', type: 'keyword' },
      { id: 'two', label: 'K', type: 'identifier' },
      { id: 'three', label: 'K', type: 'identifier' },
      { id: 'four', label: 'T', type: 'identifier' },
      { id: 'five', label: 'extends', type: 'keyword' },
      { id: 'six', label: 'infer', type: 'keyword' },
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
        acceptedBlockIds: ['four'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s2: {
        id: 's2',
        acceptedBlockIds: ['one'],
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
        acceptedBlockIds: ['two', 'three'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
    },
  },

  {
    id: 'easy-partial',
    difficulty: PuzzleDifficulty.Easy,
    title: 'MyPartial',
    description: 'Transform params into optional.', // transloco
    hintText: 'Parial. Put `?` after second bracket.', // transloco
    availableBlocks: [
      { id: 'one', label: 'T', type: 'identifier' },
      { id: 'two', label: 'K', type: 'identifier' },
      { id: 'three', label: 'K', type: 'identifier' },
      { id: 'four', label: '?', type: 'operator' },
      { id: 'five', label: 'readonly', type: 'keyword' },
      { id: 'six', label: 'extends', type: 'keyword' },
    ],
    lines: [
      {
        indent: 0,
        segments: [
          { kind: 'locked', text: 'type', tokenType: 'keyword' },
          { kind: 'locked', text: ' MyPartial', tokenType: 'identifier' },
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
          { kind: 'locked', text: '[', tokenType: 'bracket' },
          { kind: 'slot', slotId: 's2' },
          { kind: 'locked', text: ' in keyof T]', tokenType: 'keyword' },
          { kind: 'slot', slotId: 's3' },
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
        acceptedBlockIds: ['one'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s2: {
        id: 's2',
        acceptedBlockIds: ['two', 'three'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s3: {
        id: 's3',
        acceptedBlockIds: ['four'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s4: {
        id: 's4',
        acceptedBlockIds: ['two', 'three'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
    },
  },

  {
    id: 'medium-nonullable',
    difficulty: PuzzleDifficulty.Medium,
    title: 'MyNonNullable',
    description: 'Write Conditional Type that removes null and undefined from T.', //transloco
    hintText: 'Conditional Type: T extends null | undefined ? never : T', //transloco
    availableBlocks: [
      { id: 'one', label: 'T', type: 'identifier' },
      { id: 'two', label: 'extends', type: 'keyword' },
      { id: 'three', label: 'never', type: 'keyword' },
      { id: 'four', label: 'unknown', type: 'keyword' },
      { id: 'five', label: 'any', type: 'keyword' },
    ],
    lines: [
      {
        indent: 0,
        segments: [
          { kind: 'locked', text: 'type', tokenType: 'keyword' },
          { kind: 'locked', text: ' MyNonNullable', tokenType: 'identifier' },
          { kind: 'locked', text: '<', tokenType: 'bracket' },
          { kind: 'slot', slotId: 's1' },
          { kind: 'locked', text: '>', tokenType: 'bracket' },
          { kind: 'locked', text: ' =', tokenType: 'operator' },
        ],
      },
      {
        indent: 1,
        segments: [
          { kind: 'locked', text: 'T', tokenType: 'identifier' },
          { kind: 'slot', slotId: 's2' },
          { kind: 'locked', text: ' null | undefined', tokenType: 'identifier' },
          { kind: 'locked', text: ' ?', tokenType: 'operator' },
          { kind: 'slot', slotId: 's3' },
          { kind: 'locked', text: ' :', tokenType: 'operator' },
          { kind: 'locked', text: ' T', tokenType: 'identifier' },
        ],
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
        acceptedBlockIds: ['two'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s3: {
        id: 's3',
        acceptedBlockIds: ['three'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
    },
  },

  {
    id: 'medium-returntype',
    difficulty: PuzzleDifficulty.Medium,
    title: 'MyReturnType',
    description: 'Write a type that extracts the return type of function `T` (infer).', //transloco
    hintText:
      'infer R allows you to "capture" the type in a conditional expression. It follows the pattern (...:[]) => R', //tl
    availableBlocks: [
      { id: 'one', label: 'T', type: 'identifier' },
      { id: 'two', label: 'R', type: 'identifier' },
      { id: 'three', label: 'R', type: 'identifier' },
      { id: 'four', label: 'extends', type: 'keyword' },
      { id: 'five', label: 'infer', type: 'keyword' },
      { id: 'six', label: 'never', type: 'keyword' },
    ],
    lines: [
      {
        indent: 0,
        segments: [
          { kind: 'locked', text: 'type', tokenType: 'keyword' },
          { kind: 'locked', text: ' MyReturnType', tokenType: 'identifier' },
          { kind: 'locked', text: '<', tokenType: 'bracket' },
          { kind: 'slot', slotId: 's1' },
          { kind: 'locked', text: '>', tokenType: 'bracket' },
          { kind: 'locked', text: ' =', tokenType: 'operator' },
        ],
      },
      {
        indent: 1,
        segments: [
          { kind: 'locked', text: 'T', tokenType: 'identifier' },
          { kind: 'slot', slotId: 's2' },
          { kind: 'locked', text: ' ((...args: any[]) =>', tokenType: 'identifier' },
          { kind: 'slot', slotId: 's3' },
          { kind: 'locked', text: ' ', tokenType: 'identifier' },
          { kind: 'slot', slotId: 's4' },
          { kind: 'locked', text: ')', tokenType: 'bracket' },
          { kind: 'locked', text: ' ?', tokenType: 'operator' },
          { kind: 'slot', slotId: 's5' },
          { kind: 'locked', text: ' : never', tokenType: 'keyword' },
        ],
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
        acceptedBlockIds: ['five'],
        currentBlockId: null,
        locked: false,
        validationState: 'idle',
      },
      s4: {
        id: 's4',
        acceptedBlockIds: ['two', 'three'],
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

  {
    id: 'hard-readonly-partial',
    difficulty: PuzzleDifficulty.Hard,
    title: 'ReadonlyPartial',
    description: 'Create a type that makes all properties of object T both readonly and optional.',
    hintText: 'Both modifiers can be applied together: readonly [K in keyof T]?',
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
