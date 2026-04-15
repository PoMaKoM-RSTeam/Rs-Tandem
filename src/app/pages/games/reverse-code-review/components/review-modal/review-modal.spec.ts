import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { TndmCompletionModal } from './review-modal';

describe('TndmCompletionModal', () => {
  let fixture: ComponentFixture<TndmCompletionModal>;
  let component: TndmCompletionModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TndmCompletionModal,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TndmCompletionModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('score', 2);
    fixture.componentRef.setInput('maxScore', 3);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display score values', () => {
    const scoreEl = fixture.nativeElement.querySelector('.completion-modal_score');
    expect(scoreEl.textContent).toContain('2');
    expect(scoreEl.textContent).toContain('3');
  });
});
