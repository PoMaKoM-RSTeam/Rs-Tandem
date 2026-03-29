import { Puzzle } from '../models/puzzle.model';
import { PuzzleDifficulty } from '../models/puzzle-difficulty.enum';

export const DATA_ONE: Puzzle[] = [
  {
    id: 'easy-readonly',
    difficulty: PuzzleDifficulty.Easy,
    title: 'typeInvestigator.easyReadonly.title',
    description: 'typeInvestigator.easyReadonly.description',
    hintText: 'typeInvestigator.easyReadonly.hint',
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
    title: 'typeInvestigator.easyPartial.title',
    description: 'typeInvestigator.easyPartial.description',
    hintText: 'typeInvestigator.easyPartial.hint',
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
];
