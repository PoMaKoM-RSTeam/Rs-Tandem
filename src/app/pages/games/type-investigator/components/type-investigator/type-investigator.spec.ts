import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router, Routes } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { TndmTypeInvestigator } from './type-investigator';
import { Puzzle } from '../../models/puzzle.model';
import { PuzzleDifficulty } from '../../models/puzzle-difficulty.enum';

@Component({ changeDetection: ChangeDetectionStrategy.OnPush, template: '', standalone: true })
class DummyComponent {}

const testRoutes: Routes = [
  { path: '', component: DummyComponent },
  { path: ':puzzleId', component: DummyComponent },
];

describe('TndmTypeInvestigator', () => {
  let fixture: ComponentFixture<TndmTypeInvestigator>;
  let component: TndmTypeInvestigator;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TndmTypeInvestigator,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
      providers: [provideRouter(testRoutes)],
    }).compileComponents();

    fixture = TestBed.createComponent(TndmTypeInvestigator);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have allPuzzles populated from data', () => {
    expect(component.allPuzzles().length).toBeGreaterThan(0);
  });

  it('should show puzzle-select when no active puzzle', () => {
    const select = fixture.nativeElement.querySelector('tndm-puzzle-select');
    expect(select).toBeTruthy();
    const board = fixture.nativeElement.querySelector('tndm-puzzle-board');
    expect(board).toBeNull();
  });

  it('should start with no active puzzle', () => {
    expect(component.activePuzzle()).toBeNull();
  });

  it('should start with empty solvedIds', () => {
    expect(component.solvedIds().size).toBe(0);
  });

  it('progressPercent should be 0 initially', () => {
    expect(component.progressPercent()).toBe(0);
  });

  it('should not show progress bar when no puzzles solved', () => {
    const progress = fixture.nativeElement.querySelector('.ti-progress');
    expect(progress).toBeNull();
  });

  it('onPuzzleSolved should not throw when no active puzzle', () => {
    expect(() => component.onPuzzleSolved()).not.toThrow();
  });

  it('onPuzzleSolved should add puzzle id to solvedIds', () => {
    const mockPuzzle: Puzzle = {
      id: 'test-p',
      difficulty: PuzzleDifficulty.Easy,
      title: 'T',
      description: 'D',
      hintText: 'H',
      availableBlocks: [],
      lines: [],
      slots: {},
    };

    component.solvedIds.update(ids => new Set([...ids, mockPuzzle.id]));
    expect(component.solvedIds().has('test-p')).toBe(true);
  });

  it('progressPercent should reflect solved count', () => {
    const total = component.allPuzzles().length;
    component.solvedIds.set(new Set(['easy-readonly']));
    expect(component.progressPercent()).toBeCloseTo((1 / total) * 100, 1);
  });

  it('should show progress bar when puzzles are solved', () => {
    component.solvedIds.set(new Set(['easy-readonly']));
    fixture.detectChanges();
    const progress = fixture.nativeElement.querySelector('.ti-progress');
    expect(progress).toBeTruthy();
  });

  it('onPuzzleSelected should navigate to puzzle id', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    const puzzle = component.allPuzzles()[0];
    component.onPuzzleSelected(puzzle);
    expect(navSpy).toHaveBeenCalled();
    expect(navSpy.mock.calls[0][0]).toEqual([puzzle.id]);
  });

  it('onBack should navigate to parent', () => {
    const navSpy = vi.spyOn(router, 'navigate');
    component.onBack();
    expect(navSpy).toHaveBeenCalled();
    expect(navSpy.mock.calls[0][0]).toEqual(['..']);
  });
});
