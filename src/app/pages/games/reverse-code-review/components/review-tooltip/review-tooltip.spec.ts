import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslocoTestingModule } from '@jsverse/transloco';
import { TndmReviewTooltip } from './review-tooltip';
import { ErrorType } from '../../models/error-type.enum';

describe('TndmReviewTooltip', () => {
  let fixture: ComponentFixture<TndmReviewTooltip>;
  let component: TndmReviewTooltip;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TndmReviewTooltip,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: { availableLangs: ['en'], defaultLang: 'en' },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TndmReviewTooltip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render 4 error type options', () => {
    const options = fixture.nativeElement.querySelectorAll('.review-tooltip_option');
    expect(options.length).toBe(4);
  });

  it('should emit typeSelected when an option is clicked', () => {
    const emitSpy = vi.spyOn(component.typeSelected, 'emit');
    const option = fixture.nativeElement.querySelector('.review-tooltip_option') as HTMLElement;
    option.click();
    expect(emitSpy).toHaveBeenCalledWith(ErrorType.MemoryLeak);
  });

  it('should emit closed when close button is clicked', () => {
    const emitSpy = vi.spyOn(component.closed, 'emit');
    const closeBtn = fixture.nativeElement.querySelector('.review-tooltip_close') as HTMLElement;
    closeBtn.click();
    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not show error message when wrongType is false', () => {
    const error = fixture.nativeElement.querySelector('.review-tooltip_error');
    expect(error).toBeNull();
  });

  it('should show error message when wrongType is true', () => {
    fixture.componentRef.setInput('wrongType', true);
    fixture.detectChanges();
    const error = fixture.nativeElement.querySelector('.review-tooltip_error');
    expect(error).toBeTruthy();
  });
});
