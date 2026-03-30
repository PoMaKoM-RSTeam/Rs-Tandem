import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TndmLoadingOverlay } from './tndm-loading-overlay';
import { LoadingOverlayService } from '../../../core/loading-overlay/loading-overlay-service';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TndmLoadingOverlay', () => {
  let component: TndmLoadingOverlay;
  let fixture: ComponentFixture<TndmLoadingOverlay>;
  let mockLoadingService: Partial<LoadingOverlayService>;

  const loadingSignal = signal(false);

  beforeEach(async () => {
    mockLoadingService = {
      loading: loadingSignal,
    };

    await TestBed.configureTestingModule({
      imports: [TndmLoadingOverlay],
      providers: [{ provide: LoadingOverlayService, useValue: mockLoadingService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TndmLoadingOverlay);
    component = fixture.componentInstance;

    loadingSignal.set(false);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should NOT show the overlay when loading is false', () => {
    const overlay = fixture.debugElement.query(By.css('.loading-overlay'));
    expect(overlay).toBeNull();
  });

  it('should show the overlay when loading is true', () => {
    loadingSignal.set(true);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.loading-overlay'));
    const spinner = fixture.debugElement.query(By.css('.spinner'));
    const text = fixture.debugElement.query(By.css('.loading-text'));

    expect(overlay).not.toBeNull();
    expect(spinner).not.toBeNull();
    expect(text.nativeElement.textContent).toContain('Loading...');
  });

  it('should have the correct CSS classes for branding', () => {
    loadingSignal.set(true);
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.loader-container'));
    expect(container).not.toBeNull();
  });
});
