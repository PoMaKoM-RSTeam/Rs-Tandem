import { TestBed } from '@angular/core/testing';
import { SandboxService } from './sandbox.service';
import { SandboxFetcherService } from './sandbox-fetcher.service';
import { TndmAuthStateStoreService } from '@auth';
import { ToastService } from '../../../core/services/toast/toast-service';
import { LoadingOverlayService } from '../../../core/services/loading-overlay/loading-overlay-service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { DEFAULT_SANDBOX_CODE } from '../sandbox.constants';
import { signal, WritableSignal } from '@angular/core';

type SandboxData = {
  html: string;
  css: string;
  js: string;
};

type CustomSpy = {
  (...args: unknown[]): void;
  called: boolean;
  args: unknown[];
  reset: () => void;
};

const createSpy = (): CustomSpy => {
  const spy = ((...args: unknown[]): void => {
    spy.called = true;
    spy.args = args;
  }) as CustomSpy;

  spy.called = false;
  spy.args = [];
  spy.reset = (): void => {
    spy.called = false;
    spy.args = [];
  };

  return spy;
};

describe('SandboxService', (): void => {
  let service: SandboxService;

  let fetcherMock: {
    saveData: (userId: string, html: string, css: string, js: string) => unknown;
    getData: (userId: string) => unknown;
  };

  let authStoreMock: { user: WritableSignal<{ id: string } | null> };
  let toastServiceMock: {
    success: CustomSpy;
    danger: CustomSpy;
    warning: CustomSpy;
  };
  let loadingServiceMock: {
    show: CustomSpy;
    hide: CustomSpy;
  };
  let sanitizerMock: { bypassSecurityTrustHtml: (val: string) => SafeHtml };

  let saveDataSubject: Subject<void>;
  let getDataSubject: Subject<SandboxData | undefined>;

  let saveDataSpy: CustomSpy;
  let getDataSpy: CustomSpy;

  beforeEach((): void => {
    saveDataSubject = new Subject<void>();
    getDataSubject = new Subject<SandboxData | undefined>();

    saveDataSpy = createSpy();
    getDataSpy = createSpy();

    fetcherMock = {
      saveData: (userId: string, html: string, css: string, js: string): unknown => {
        saveDataSpy(userId, html, css, js);
        return saveDataSubject.asObservable();
      },
      getData: (userId: string): unknown => {
        getDataSpy(userId);
        return getDataSubject.asObservable();
      },
    };

    authStoreMock = {
      user: signal<{ id: string } | null>(null),
    };

    toastServiceMock = {
      success: createSpy(),
      danger: createSpy(),
      warning: createSpy(),
    };

    loadingServiceMock = {
      show: createSpy(),
      hide: createSpy(),
    };

    sanitizerMock = {
      bypassSecurityTrustHtml: (val: string): SafeHtml => val as unknown as SafeHtml,
    };

    TestBed.configureTestingModule({
      providers: [
        SandboxService,
        { provide: SandboxFetcherService, useValue: fetcherMock },
        { provide: TndmAuthStateStoreService, useValue: authStoreMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: LoadingOverlayService, useValue: loadingServiceMock },
        { provide: DomSanitizer, useValue: sanitizerMock },
      ],
    });

    service = TestBed.inject(SandboxService);
  });

  it('should be created', (): void => {
    expect(service).toBeTruthy();
  });

  describe('Signal Defaults', (): void => {
    it('should have default codes from constants', (): void => {
      expect(service.htmlCode()).toBe(DEFAULT_SANDBOX_CODE.html);
      expect(service.cssCode()).toBe(DEFAULT_SANDBOX_CODE.css);
      expect(service.jsCode()).toBe(DEFAULT_SANDBOX_CODE.javascript);
    });

    it('should have initial selected tab 0 and active tab HTML', (): void => {
      expect(service.selectedTab()).toBe(0);
      expect(service.activeTabType()).toBe('HTML');
      expect(service.activeCode()).toBe(DEFAULT_SANDBOX_CODE.html);
    });
  });

  describe('Tab Operations', (): void => {
    it('should update active code when active tab changes', (): void => {
      service.selectedTab.set(1);
      expect(service.activeTabType()).toBe('CSS');
      expect(service.activeCode()).toBe(DEFAULT_SANDBOX_CODE.css);

      service.selectedTab.set(2);
      expect(service.activeTabType()).toBe('JS');
      expect(service.activeCode()).toBe(DEFAULT_SANDBOX_CODE.javascript);
    });

    it('should update specific code via updateActiveCode', (): void => {
      service.selectedTab.set(0);
      service.updateActiveCode('<h1>New Tab Content</h1>');
      expect(service.htmlCode()).toBe('<h1>New Tab Content</h1>');
      expect(service.activeCode()).toBe('<h1>New Tab Content</h1>');
    });
  });

  describe('Fullscreen Operations', (): void => {
    it('should toggle fullscreen signal', (): void => {
      expect(service.isFullscreen()).toBe(false);
      service.toggleFullscreen();
      expect(service.isFullscreen()).toBe(true);
    });

    it('should call layout on editor instance if it exists', async (): Promise<void> => {
      const layoutPromise = new Promise<void>((resolve): void => {
        const editorSpy = {
          layout: (): void => {
            expect(true).toBe(true);
            resolve();
          },
        };

        service.setEditorInstance(editorSpy as unknown as Parameters<typeof service.setEditorInstance>[0]);
        service.toggleFullscreen();
      });

      return layoutPromise;
    });
  });

  describe('Save Operation', (): void => {
    it('should show danger toast and return if user is not logged in', (): void => {
      authStoreMock.user.set(null);

      service.save();

      expect(toastServiceMock.danger.called).toBe(true);
    });

    it('should call loading show and fetcher.saveData when logged in', (): void => {
      authStoreMock.user.set({ id: 'user-123' });

      service.save();

      expect(loadingServiceMock.show.called).toBe(true);
      expect(saveDataSpy.called).toBe(true);
      expect(saveDataSpy.args).toEqual(['user-123', service.htmlCode(), service.cssCode(), service.jsCode()]);
    });

    it('should hide loading and show success toast on successful save', (): void => {
      authStoreMock.user.set({ id: 'user-123' });
      service.save();

      saveDataSubject.next();

      expect(loadingServiceMock.hide.called).toBe(true);
      expect(toastServiceMock.success.called).toBe(true);
      expect(toastServiceMock.success.args).toEqual(['Success', 'You code saved']);
    });

    it('should hide loading and show danger toast on failed save', (): void => {
      const errorResponse = { message: 'Network Error' };

      authStoreMock.user.set({ id: 'user-123' });
      service.save();

      saveDataSubject.error(errorResponse);

      expect(loadingServiceMock.hide.called).toBe(true);
      expect(toastServiceMock.danger.called).toBe(true);
      expect(toastServiceMock.danger.args).toEqual(['Error saving result', 'Network Error']);
    });
  });

  describe('Download Operation', (): void => {
    it('should show danger toast and return if user is not logged in on download', (): void => {
      authStoreMock.user.set(null);

      service.download();

      expect(toastServiceMock.danger.called).toBe(true);
    });

    it('should call loading show and fetcher.getData when logged in', (): void => {
      authStoreMock.user.set({ id: 'user-123' });

      service.download();

      expect(loadingServiceMock.show.called).toBe(true);
      expect(getDataSpy.called).toBe(true);
      expect(getDataSpy.args).toEqual(['user-123']);
    });

    it('should update codes and show success toast when data is loaded', (): void => {
      const mockData: SandboxData = { html: 'new-html', css: 'new-css', js: 'new-js' };

      authStoreMock.user.set({ id: 'user-123' });
      service.download();

      getDataSubject.next(mockData);

      expect(service.htmlCode()).toBe('new-html');
      expect(service.cssCode()).toBe('new-css');
      expect(service.jsCode()).toBe('new-js');
      expect(toastServiceMock.success.called).toBe(true);
      expect(toastServiceMock.success.args).toEqual(['Success', 'Data loaded successfully!']);
    });

    it('should show warning toast when no data is returned', (): void => {
      authStoreMock.user.set({ id: 'user-123' });
      service.download();

      getDataSubject.next(undefined);

      expect(toastServiceMock.warning.called).toBe(true);
      expect(toastServiceMock.warning.args).toEqual(['Attention', 'No saved data found.']);
    });
  });
});
