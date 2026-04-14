import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { TndmPuzzleBoard } from './puzzle-board';
import { Puzzle } from '../../models/puzzle.model';
import { PuzzleDifficulty } from '../../models/puzzle-difficulty.enum';

const mockPuzzle: Puzzle = {
  id: 'test-puzzle',
  difficulty: PuzzleDifficulty.Easy,
  title: 'typeInvestigator.easyReadonly.title',
  description: 'typeInvestigator.easyReadonly.description',
  hintText: 'typeInvestigator.easyReadonly.hint',
  availableBlocks: [
    { id: 'b1', label: 'T', type: 'identifier' },
    { id: 'b2', label: 'readonly', type: 'keyword' },
    { id: 'b3', label: 'K', type: 'identifier' },
  ],
  lines: [
    {
      indent: 0,
      segments: [
        { kind: 'locked', text: 'type', tokenType: 'keyword' },
        { kind: 'slot', slotId: 's1' },
      ],
    },
    {
      indent: 1,
      segments: [
        { kind: 'slot', slotId: 's2' },
        { kind: 'locked', text: ' [K in keyof T]', tokenType: 'keyword' },
      ],
    },
  ],
  slots: {
    s1: { id: 's1', acceptedBlockIds: ['b1'], currentBlockId: null, locked: false, validationState: 'idle' },
    s2: { id: 's2', acceptedBlockIds: ['b2'], currentBlockId: null, locked: false, validationState: 'idle' },
  },
};

describe('TndmPuzzleBoard component', () => {
  let fixture: ComponentFixture<TndmPuzzleBoard>;
  let component: TndmPuzzleBoard;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TndmPuzzleBoard,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TndmPuzzleBoard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('puzzle', mockPuzzle);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize state with all blocks in palette', () => {
    expect(component.state().paletteBlockIds).toEqual(['b1', 'b2', 'b3']);
  });

  it('should have all slots empty initially', () => {
    const slots = component.state().slots;
    expect(slots['s1'].currentBlockId).toBeNull();
    expect(slots['s2'].currentBlockId).toBeNull();
  });

  it('allSlotsFilled should be false initially', () => {
    expect(component.allSlotsFilled()).toBe(false);
  });

  it('isSolved should be false initially', () => {
    expect(component.isSolved()).toBe(false);
  });

  it('showHint should be false initially', () => {
    expect(component.showHint()).toBe(false);
  });

  it('toggleHint should flip showHint', () => {
    component.toggleHint();
    expect(component.showHint()).toBe(true);
    component.toggleHint();
    expect(component.showHint()).toBe(false);
  });
});
