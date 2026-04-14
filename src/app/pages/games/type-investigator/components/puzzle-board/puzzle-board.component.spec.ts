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

  it('resetPuzzle should clear all slots and reset solved', () => {
    component.state.update(s => {
      const slots = { ...s.slots };
      slots['s1'] = { ...slots['s1'], currentBlockId: 'b1' };
      return { ...s, slots, paletteBlockIds: s.paletteBlockIds.filter(id => id !== 'b1') };
    });
    expect(component.state().slots['s1'].currentBlockId).toBe('b1');

    component.resetPuzzle();
    expect(component.state().slots['s1'].currentBlockId).toBeNull();
    expect(component.state().paletteBlockIds).toContain('b1');
    expect(component.isSolved()).toBe(false);
  });

  it('checkSolution with wrong blocks should not set isSolved', () => {
    component.state.update(s => {
      const slots = { ...s.slots };
      slots['s1'] = { ...slots['s1'], currentBlockId: 'b3' };
      slots['s2'] = { ...slots['s2'], currentBlockId: 'b1' };
      return { ...s, slots, paletteBlockIds: [] };
    });
    component.checkSolution();
    expect(component.isSolved()).toBe(false);
    expect(component.state().slots['s1'].validationState).toBe('wrong');
  });

  it('checkSolution with correct blocks should set isSolved and emit solved', () => {
    const solvedSpy = vi.spyOn(component.solved, 'emit');
    component.state.update(s => {
      const slots = { ...s.slots };
      slots['s1'] = { ...slots['s1'], currentBlockId: 'b1' };
      slots['s2'] = { ...slots['s2'], currentBlockId: 'b2' };
      return { ...s, slots, paletteBlockIds: ['b3'] };
    });
    component.checkSolution();
    expect(component.isSolved()).toBe(true);
    expect(solvedSpy).toHaveBeenCalled();
    expect(component.state().slots['s1'].validationState).toBe('correct');
    expect(component.state().slots['s2'].validationState).toBe('correct');
  });

  it('should emit back when back button is clicked', () => {
    const backSpy = vi.spyOn(component.back, 'emit');
    const backBtn = fixture.nativeElement.querySelector('.puzzle-board_back') as HTMLElement;
    backBtn.click();
    expect(backSpy).toHaveBeenCalled();
  });

  it('should render locked tokens and slots', () => {
    const tokens = fixture.nativeElement.querySelectorAll('.puzzle-board_token');
    expect(tokens.length).toBeGreaterThan(0);

    const slots = fixture.nativeElement.querySelectorAll('.puzzle-board_slot');
    expect(slots.length).toBe(2);
  });

  it('should render palette blocks', () => {
    const blocks = fixture.nativeElement.querySelectorAll('.puzzle-board_palette .puzzle-board_block');
    expect(blocks.length).toBe(3);
  });

  it('should show difficulty badge', () => {
    const badge = fixture.nativeElement.querySelector('.puzzle-board_difficulty');
    expect(badge).toBeTruthy();
    expect(badge.classList.contains('puzzle-board_difficulty--easy')).toBe(true);
  });

  it('should re-initialize state when puzzle input changes', async () => {
    const newPuzzle: Puzzle = {
      ...mockPuzzle,
      id: 'new-puzzle',
      availableBlocks: [{ id: 'x1', label: 'X', type: 'identifier' }],
      lines: [
        {
          indent: 0,
          segments: [{ kind: 'slot', slotId: 's1' }],
        },
      ],
      slots: {
        s1: { id: 's1', acceptedBlockIds: ['x1'], currentBlockId: null, locked: false, validationState: 'idle' },
      },
    };
    fixture.componentRef.setInput('puzzle', newPuzzle);
    fixture.detectChanges();
    expect(component.state().paletteBlockIds).toEqual(['x1']);
    expect(component.isSolved()).toBe(false);
    expect(component.showHint()).toBe(false);
  });
});
