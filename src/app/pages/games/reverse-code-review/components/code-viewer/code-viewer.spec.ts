import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { TndmCodeViewer } from './code-viewer';
import { ReviewCase } from '../../models/review-case.model';
import { ErrorType } from '../../models/error-type.enum';

const mockCase: ReviewCase = {
  id: 'test-case',
  category: 'Performance',
  difficulty: 'Junior',
  title: 'Test Case',
  code: `const x = 1;
const y = 2;
const z = 3;`,
  expectedErrors: [
    { line: 2, type: ErrorType.Performance, message: 'Performance issue here', points: 2 },
    { line: 3, type: ErrorType.Security, message: 'Security issue here', points: 1 },
  ],
};

describe('TndmCodeViewer', () => {
  let fixture: ComponentFixture<TndmCodeViewer>;
  let component: TndmCodeViewer;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TndmCodeViewer,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TndmCodeViewer);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('reviewCase', mockCase);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize linesState from code', () => {
    expect(component.linesState().length).toBe(3);
    expect(component.linesState()[0].lineNumber).toBe(1);
    expect(component.linesState()[1].lineNumber).toBe(2);
    expect(component.linesState()[2].lineNumber).toBe(3);
  });

  it('should compute totalErrors from expectedErrors', () => {
    expect(component.totalErrors()).toBe(2);
  });

  it('should start with zero score and foundCount', () => {
    expect(component.score()).toBe(0);
    expect(component.foundCount()).toBe(0);
  });

  it('should render line numbers', () => {
    const lineNums = fixture.nativeElement.querySelectorAll('.viewer_line-num');
    expect(lineNums.length).toBe(3);
    expect(lineNums[0].textContent.trim()).toBe('1');
  });

  it('should render highlighted code lines', () => {
    expect(component.highlightedLines().length).toBe(3);
  });

  it('should display title and category in header', () => {
    const filename = fixture.nativeElement.querySelector('.viewer_filename');
    const category = fixture.nativeElement.querySelector('.viewer_category');
    expect(filename.textContent.trim()).toBe('Test Case');
    expect(category.textContent.trim()).toBe('Performance');
  });

  it('should open tooltip when clicking a line with an error', () => {
    const lines = fixture.nativeElement.querySelectorAll('.viewer_line');
    lines[1].click();
    fixture.detectChanges();
    expect(component.tooltipLine()).toBe(2);
  });

  it('should not open tooltip when clicking a line without an error', () => {
    const lines = fixture.nativeElement.querySelectorAll('.viewer_line');
    lines[0].click();
    fixture.detectChanges();
    expect(component.tooltipLine()).toBeNull();
  });
});
