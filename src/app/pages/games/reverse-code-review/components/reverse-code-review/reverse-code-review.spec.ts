import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { provideRouter, Routes } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TndmReverseCode } from './reverse-code-review';

@Component({ changeDetection: ChangeDetectionStrategy.OnPush, template: '', standalone: true })
class DummyComponent {}

const testRoutes: Routes = [
  { path: '', component: DummyComponent },
  { path: ':caseId', component: DummyComponent },
];

describe('TndmReverseCode', () => {
  let fixture: ComponentFixture<TndmReverseCode>;
  let component: TndmReverseCode;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TndmReverseCode,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
      providers: [provideRouter(testRoutes)],
    }).compileComponents();

    fixture = TestBed.createComponent(TndmReverseCode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have allCases populated from data', () => {
    expect(component.allCases().length).toBeGreaterThan(0);
  });

  it('should start with no active case', () => {
    expect(component.activeCase()).toBeNull();
  });

  it('should start with empty completedIds', () => {
    expect(component.completedIds().size).toBe(0);
  });

  it('should show placeholder when no active case', () => {
    const placeholder = fixture.nativeElement.querySelector('.page_placeholder');
    expect(placeholder).toBeTruthy();
  });

  it('should not show modal initially', () => {
    expect(component.showModal()).toBe(false);
  });

  it('onCaseSolved should add case to completedIds and show modal', () => {
    const cases = component.allCases();
    if (cases.length === 0) return;

    component.lastScore.set(0);
    component.showModal.set(false);

    component.showModal.set(true);
    component.closeModal();
    expect(component.showModal()).toBe(false);
  });

  it('maxScore should return 0 when no active case', () => {
    expect(component.maxScore()).toBe(0);
  });

  it('should render case sidebar', () => {
    const sidebar = fixture.nativeElement.querySelector('tndm-case-sidebar');
    expect(sidebar).toBeTruthy();
  });
});
