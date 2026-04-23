import { TestBed } from '@angular/core/testing';
import { SandboxService } from './sandbox.service';
import { SandboxFetcherService } from './sandbox-fetcher.service';
import { TndmAuthStateStoreService } from '@auth';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Observable, of, Subject, throwError } from 'rxjs';
import { DEFAULT_SANDBOX_CODE } from '../sandbox.constants';
import { signal, WritableSignal } from '@angular/core';
import { ToastService } from '../../../core/toast/toast-service';
import { LoadingOverlayService } from '../../../core/loading-overlay/loading-overlay-service';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { SandboxResponse } from '../types/sandbox-response';
import type * as Monaco from 'monaco-editor';

describe('SandboxService', (): void => {
  let service: SandboxService;

  let fetcherMock: {
    saveData: Mock<(userId: string, html: string, css: string, js: string) => Observable<void>>;
    getData: Mock<(userId: string) => Observable<SandboxResponse | undefined>>;
  };

  let authStoreMock: { user: WritableSignal<{ id: string } | null> };

  let toastServiceMock: Partial<Record<keyof ToastService, Mock>>;
  let loadingServiceMock: Partial<Record<keyof LoadingOverlayService, Mock>>;
  let sanitizerMock: Partial<DomSanitizer>;

  beforeEach((): void => {
    fetcherMock = {
      saveData: vi.fn().mockReturnValue(of(undefined)),
      getData: vi.fn().mockReturnValue(of(undefined)),
    };

    authStoreMock = {
      user: signal<{ id: string } | null>(null),
    };

    toastServiceMock = {
      success: vi.fn(),
      danger: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    };

    loadingServiceMock = {
      show: vi.fn(),
      hide: vi.fn(),
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
    });

    it('should update specific code via updateActiveCode', (): void => {
      service.selectedTab.set(0);
      service.updateActiveCode('<h1>New Tab Content</h1>');
      expect(service.htmlCode()).toBe('<h1>New Tab Content</h1>');
    });
  });

  describe('Fullscreen Operations', (): void => {
    it('should toggle fullscreen signal', (): void => {
      expect(service.isFullscreen()).toBe(false);
      service.toggleFullscreen();
      expect(service.isFullscreen()).toBe(true);
    });

    it('should call layout on editor instance after microtask', async (): Promise<void> => {
      const editorSpy = {
        layout: vi.fn(),
      } as unknown as Monaco.editor.IStandaloneCodeEditor;

      service.setEditorInstance(editorSpy);
      service.toggleFullscreen();

      await Promise.resolve();
      expect(editorSpy.layout).toHaveBeenCalled();
    });
  });

  describe('Save Operation', (): void => {
    it('should show danger toast and return EMPTY if user is not logged in', (): void => {
      authStoreMock.user.set(null);
      let called = false;

      service.save().subscribe({
        next: () => (called = true),
      });

      expect(toastServiceMock.danger).toHaveBeenCalledWith('Error saving result', expect.any(String));
      expect(called).toBe(false);
    });

    it('should call loading show and fetcher.saveData when logged in', (): void => {
      authStoreMock.user.set({ id: 'user-123' });
      service.save().subscribe();

      expect(loadingServiceMock.show).toHaveBeenCalled();
      expect(fetcherMock.saveData).toHaveBeenCalledWith(
        'user-123',
        service.htmlCode(),
        service.cssCode(),
        service.jsCode()
      );
    });

    it('should hide loading via finalize when observable completes', (): void => {
      authStoreMock.user.set({ id: 'user-123' });
      const saveDataSubject = new Subject<void>();
      fetcherMock.saveData.mockReturnValue(saveDataSubject.asObservable());

      service.save().subscribe();
      saveDataSubject.next();
      saveDataSubject.complete();

      expect(loadingServiceMock.hide).toHaveBeenCalled();
    });
  });

  describe('Download Operation', (): void => {
    it('should call fetcher.getData and update signals on success', (): void => {
      const mockData: SandboxResponse = { html: 'new-html', css: 'new-css', js: 'new-js' };
      authStoreMock.user.set({ id: 'user-123' });
      fetcherMock.getData.mockReturnValue(of(mockData));

      service.download().subscribe();

      expect(service.htmlCode()).toBe('new-html');
      expect(service.cssCode()).toBe('new-css');
      expect(service.jsCode()).toBe('new-js');
    });

    it('should show danger toast and return EMPTY if not logged in on download', (): void => {
      authStoreMock.user.set(null);
      service.download().subscribe();
      expect(toastServiceMock.danger).toHaveBeenCalledWith('Error fetching data', expect.any(String));
    });

    it('should still hide loading even if request fails', (): void => {
      authStoreMock.user.set({ id: 'user-123' });
      fetcherMock.getData.mockReturnValue(throwError(() => new Error('Fail')));

      service.download().subscribe({
        error: (err: Error) => expect(err.message).toBe('Fail'),
      });

      expect(loadingServiceMock.hide).toHaveBeenCalled();
    });
  });
});
