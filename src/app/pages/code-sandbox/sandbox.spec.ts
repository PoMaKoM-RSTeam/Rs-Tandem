import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TndmSandbox } from './sandbox';
import { SandboxService } from './services/sandbox.service';
import { computed, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

class MockSandboxService {
  readonly isFullscreen = signal(false);
  readonly selectedTab = signal(0);
  readonly tabs = ['HTML', 'CSS', 'JS'];
  readonly activeCode = signal('<h1>Hello</h1>');

  readonly activeEditorOptions = computed(() => ({
    theme: 'vs',
    language: 'html',
  }));

  readonly previewContent = computed<SafeHtml>(() => '<h1>Hello</h1>' as unknown as SafeHtml);

  updateActiveCode = (val: string): void => {
    this.activeCode.set(val);
  };

  save = (): void => {};
  download = (): void => {};

  toggleFullscreen = (): void => {
    this.isFullscreen.update(v => !v);
  };
}

describe('TndmSandbox', (): void => {
  let component: TndmSandbox;
  let fixture: ComponentFixture<TndmSandbox>;
  let mockService: MockSandboxService;

  beforeEach(async (): Promise<void> => {
    mockService = new MockSandboxService();

    await TestBed.configureTestingModule({
      imports: [TndmSandbox],
    })
      .overrideComponent(TndmSandbox, {
        set: {
          providers: [{ provide: SandboxService, useValue: mockService }],
          imports: [],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
        },
      })
      .compileComponents();

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
      expect(config.variant).toBe('icon');
      expect(config.size).toBe('lg');
    });

    it('should compute fullscreen button config for fullscreen', (): void => {
      mockService.isFullscreen.set(true);
      fixture.detectChanges();

      const config = component['fullscreenBtnConfig']();
      expect(config.icon).toBe('fullscreenExit');
    });

    it('should hold static button configs', (): void => {
      expect(component['downloadBtnConfig'].icon).toBe('download');
      expect(component['saveBtnConfig'].icon).toBe('save');
    });
  });

  describe('User Interactions and Delegation', (): void => {
    it('should update selected tab in service on tab change', (): void => {
      const setSpy = vi.spyOn(mockService.selectedTab, 'set');

      component['onTabChange'](1);

      expect(setSpy).toHaveBeenCalledWith(1);
    });

    it('should call service updateActiveCode on code update', (): void => {
      const updateSpy = vi.spyOn(mockService, 'updateActiveCode');

      component['updateCode']('new code');

      expect(updateSpy).toHaveBeenCalledWith('new code');
    });

    it('should delegate save to service', (): void => {
      const saveSpy = vi.spyOn(mockService, 'save');

      component['save']();

      expect(saveSpy).toHaveBeenCalled();
    });

    it('should delegate download to service', (): void => {
      const downloadSpy = vi.spyOn(mockService, 'download');

      component['download']();

      expect(downloadSpy).toHaveBeenCalled();
    });

    it('should delegate toggleFullscreen to service', (): void => {
      const fullscreenSpy = vi.spyOn(mockService, 'toggleFullscreen');

      component['toggleFullscreen']();

      expect(fullscreenSpy).toHaveBeenCalled();
    });
  });
});
