import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { TndmTypeInvestigator } from './type-investigator';

@Component({ changeDetection: ChangeDetectionStrategy.OnPush, template: '', standalone: true })
class DummyComponent {}

const testRoutes: Routes = [
  { path: '', component: DummyComponent },
  { path: ':puzzleId', component: DummyComponent },
];

describe('TndmTypeInvestigator', () => {
  let fixture: ComponentFixture<TndmTypeInvestigator>;
  let component: TndmTypeInvestigator;

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
});
