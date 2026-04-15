import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { TndmCaseSidebar } from './case-sidebar';
import { ReviewCase } from '../../models/review-case.model';
import { ErrorType } from '../../models/error-type.enum';

const mockCases: ReviewCase[] = [
  {
    id: 'c1',
    category: 'Performance',
    difficulty: 'Junior',
    title: 'Case 1',
    code: 'const x = 1;',
    expectedErrors: [{ line: 1, type: ErrorType.Performance, message: 'test', points: 1 }],
  },
  {
    id: 'c2',
    category: 'Security',
    difficulty: 'Middle',
    title: 'Case 2',
    code: 'const y = 2;',
    expectedErrors: [{ line: 1, type: ErrorType.Security, message: 'test', points: 1 }],
  },
];

describe('TndmCaseSidebar', () => {
  let fixture: ComponentFixture<TndmCaseSidebar>;
  let component: TndmCaseSidebar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TndmCaseSidebar,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TndmCaseSidebar);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('cases', mockCases);
    fixture.componentRef.setInput('activeCaseId', null);
    fixture.componentRef.setInput('completedIds', new Set<string>());
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a button for each case', () => {
    const items = fixture.nativeElement.querySelectorAll('.sidebar_item');
    expect(items.length).toBe(mockCases.length);
  });

  it('should show case titles', () => {
    const names = fixture.nativeElement.querySelectorAll('.sidebar_name');
    expect(names[0].textContent.trim()).toBe('Case 1');
    expect(names[1].textContent.trim()).toBe('Case 2');
  });

  it('should highlight the active case', () => {
    fixture.componentRef.setInput('activeCaseId', 'c1');
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.sidebar_item');
    expect(items[0].classList.contains('sidebar_item--active')).toBe(true);
    expect(items[1].classList.contains('sidebar_item--active')).toBe(false);
  });

  it('should mark completed cases', () => {
    fixture.componentRef.setInput('completedIds', new Set(['c2']));
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.sidebar_item');
    expect(items[1].classList.contains('sidebar_item--done')).toBe(true);
    const check = items[1].querySelector('.sidebar_check');
    expect(check).toBeTruthy();
  });

  it('should emit caseSelected when case is clicked', () => {
    const emitSpy = vi.spyOn(component.caseSelected, 'emit');
    const item = fixture.nativeElement.querySelector('.sidebar_item');
    item.click();
    expect(emitSpy).toHaveBeenCalledWith(mockCases[0]);
  });

  it('should show difficulty badge with correct data-diff', () => {
    const badges = fixture.nativeElement.querySelectorAll('.sidebar_difficulty');
    expect(badges[0].getAttribute('data-diff')).toBe('Junior');
    expect(badges[1].getAttribute('data-diff')).toBe('Middle');
  });
});
