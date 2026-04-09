import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TndmSandbox } from './sandbox';
import { SandboxService } from './services/sandbox.service';
import { computed, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ToastService } from '../../core/toast/toast-service';
import { TranslocoPipe, TranslocoService, TranslocoTestingModule } from '@jsverse/transloco';
import { TranslateParams } from '@jsverse/transloco';
import { Observable, of, throwError } from 'rxjs';

class MockSandboxService {
  readonly isFullscreen = signal(false);
  readonly selectedTab = signal(0);
  readonly tabs: string[] = ['HTML', 'CSS', 'JS'];
  readonly activeCode = signal('<h1>Hello</h1>');

  readonly activeEditorOptions = computed(() => ({
    theme: 'vs',
    language: 'html',
  }));

  readonly previewContent = computed<SafeHtml>(() => '<h1>Hello</h1>' as unknown as SafeHtml);

  updateActiveCode = (val: string): void => {
    this.activeCode.set(val);
  };

  save = (): Observable<{ success: boolean }> => {
    return of({ success: true });
  };

  download = (): Observable<{ data: string } | null> => {
    return of({ data: 'test' });
  };

  toggleFullscreen = (): void => {
    this.isFullscreen.update((v: boolean) => !v);
  };
}

const mockToastService = {
  success: vi.fn(),
  danger: vi.fn(),
  warning: vi.fn(),
};

describe('TndmSandbox', (): void => {
  let component: TndmSandbox;
  let fixture: ComponentFixture<TndmSandbox>;
  let mockService: MockSandboxService;
  let translocoService: TranslocoService;

  beforeEach(async (): Promise<void> => {
    mockService = new MockSandboxService();

    await TestBed.configureTestingModule({
      imports: [
        TndmSandbox,
        TranslocoTestingModule.forRoot({
          langs: { en: {} },
          translocoConfig: {
            defaultLang: 'en',
            availableLangs: ['en'],
          },
        }),
      ],
    })
      .overrideComponent(TndmSandbox, {
        set: {
          providers: [
            { provide: SandboxService, useValue: mockService },
            { provide: ToastService, useValue: mockToastService },
          ],
          imports: [TranslocoPipe],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

    translocoService = TestBed.inject(TranslocoService);
    vi.spyOn(translocoService, 'translate').mockImplementation((key: TranslateParams) => {
      return typeof key === 'string' ? key : key.toString();
    });

    fixture = TestBed.createComponent(TndmSandbox);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', (): void => {
    expect(component).toBeTruthy();
  });

  describe('Buttons Configuration', (): void => {
    it('should compute fullscreen button config for normal screen', (): void => {
      mockService.isFullscreen.set(false);
      fixture.detectChanges();

      const config = component['fullscreenBtnConfig']();
      expect(config.icon).toBe('fullscreen');
    });

    it('should compute fullscreen button config for fullscreen', (): void => {
      mockService.isFullscreen.set(true);
      fixture.detectChanges();

      const config = component['fullscreenBtnConfig']();
      expect(config.icon).toBe('fullscreenExit');
    });
  });

  describe('Interactions with Services', (): void => {
    it('should call toastService success on successful save', (): void => {
      const saveSpy = vi.spyOn(mockService, 'save').mockReturnValue(of({ success: true }));
      const toastSpy = vi.spyOn(mockToastService, 'success');

      component['save']();

      expect(saveSpy).toHaveBeenCalled();
      expect(toastSpy).toHaveBeenCalledWith('sandbox.success', 'sandbox.dataSaved');
    });

    it('should call toastService danger on save error', (): void => {
      vi.spyOn(mockService, 'save').mockReturnValue(throwError(() => ({ message: 'Error' })));
      const toastSpy = vi.spyOn(mockToastService, 'danger');

      component['save']();

      expect(toastSpy).toHaveBeenCalledWith('sandbox.errorSave', 'Error');
    });

    it('should call toastService warning when download returns no data', (): void => {
      vi.spyOn(mockService, 'download').mockReturnValue(of(null));
      const toastSpy = vi.spyOn(mockToastService, 'warning');

      component['download']();

      expect(toastSpy).toHaveBeenCalledWith('sandbox.warning', 'sandbox.noData');
    });

    it('should delegate toggleFullscreen to service', (): void => {
      const fullscreenSpy = vi.spyOn(mockService, 'toggleFullscreen');
      component['toggleFullscreen']();
      expect(fullscreenSpy).toHaveBeenCalled();
    });
  });
});
