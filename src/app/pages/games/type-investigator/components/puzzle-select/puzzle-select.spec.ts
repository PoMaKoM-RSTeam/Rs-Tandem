import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { TndmPuzzleSelect } from './puzzle-select';
import { Puzzle } from '../../models/puzzle.model';
import { PuzzleDifficulty } from '../../models/puzzle-difficulty.enum';

const mockPuzzles: Puzzle[] = [
  {
    id: 'p1',
    difficulty: PuzzleDifficulty.Easy,
    title: 'ti.p1.title',
    description: 'ti.p1.desc',
    hintText: '',
    availableBlocks: [{ id: 'b1', label: 'T', type: 'identifier' }],
    lines: [],
    slots: { s1: { id: 's1', acceptedBlockIds: ['b1'], currentBlockId: null, locked: false, validationState: 'idle' } },
  },
  {
    id: 'p2',
    difficulty: PuzzleDifficulty.Hard,
    title: 'ti.p2.title',
    description: 'ti.p2.desc',
    hintText: '',
    availableBlocks: [{ id: 'b1', label: 'K', type: 'identifier' }],
    lines: [],
    slots: { s1: { id: 's1', acceptedBlockIds: ['b1'], currentBlockId: null, locked: false, validationState: 'idle' } },
  },
];

describe('TndmPuzzleSelect', () => {
  let fixture: ComponentFixture<TndmPuzzleSelect>;
  let component: TndmPuzzleSelect;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TndmPuzzleSelect,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TndmPuzzleSelect);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('puzzles', mockPuzzles);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a card for each puzzle', () => {
    const cards = fixture.nativeElement.querySelectorAll('.puzzle-select_card');
    expect(cards.length).toBe(mockPuzzles.length);
  });

  it('should apply difficulty CSS class to cards', () => {
    const cards = fixture.nativeElement.querySelectorAll('.puzzle-select_card');
    expect(cards[0].classList.contains('puzzle-select_card--easy')).toBe(true);
    expect(cards[1].classList.contains('puzzle-select_card--hard')).toBe(true);
  });

  it('should emit puzzleSelected when card is clicked', () => {
    const emitSpy = vi.spyOn(component.puzzleSelected, 'emit');
    const card = fixture.nativeElement.querySelector('.puzzle-select_card') as HTMLElement;
    card.click();
    expect(emitSpy).toHaveBeenCalledWith(mockPuzzles[0]);
  });

  it('difficultyLabel should return correct labels', () => {
    expect(component.difficultyLabel(PuzzleDifficulty.Easy)).toBe('Easy');
    expect(component.difficultyLabel(PuzzleDifficulty.Medium)).toBe('Medium');
    expect(component.difficultyLabel(PuzzleDifficulty.Hard)).toBe('Hard');
  });
});
