import { computed, inject, Injectable, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TndmAuthStateStoreService } from '@auth';
import { ToastService } from '../../../core/services/toast/toast-service';
import { SandboxFetcherService } from './sandbox-fetcher.service';
import { LoadingOverlayService } from '../../../core/services/loading-overlay/loading-overlay-service';
import { DEFAULT_SANDBOX_CODE } from '../sandbox.constants';
import { finalize, take } from 'rxjs';
import type * as Monaco from 'monaco-editor';

type Tab = 'HTML' | 'CSS' | 'JS';

@Injectable()
export class SandboxService {
  private readonly fetcher = inject(SandboxFetcherService);
  private readonly authStore = inject(TndmAuthStateStoreService);
  private readonly toastService = inject(ToastService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly loadingService = inject(LoadingOverlayService);

  private editorInstance: Monaco.editor.IStandaloneCodeEditor | null = null;

  readonly htmlCode = signal(DEFAULT_SANDBOX_CODE.html);
  readonly cssCode = signal(DEFAULT_SANDBOX_CODE.css);
  readonly jsCode = signal(DEFAULT_SANDBOX_CODE.javascript);
  readonly isFullscreen = signal(false);

  readonly tabs: Tab[] = ['HTML', 'CSS', 'JS'];
  readonly selectedTab = signal<number>(0);

  readonly editorOptions = {
    theme: 'vs',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
  };

  readonly tabMap = {
    HTML: { code: this.htmlCode, lang: 'html' },
    CSS: { code: this.cssCode, lang: 'css' },
    JS: { code: this.jsCode, lang: 'javascript' },
  } as const;

  readonly userId = computed(() => this.authStore.user()?.id);
  readonly activeTabType = computed(() => this.tabs[this.selectedTab()]);
  readonly activeCode = computed(() => this.tabMap[this.activeTabType()].code());

  readonly activeEditorOptions = computed(() => ({
    ...this.editorOptions,
    language: this.tabMap[this.activeTabType()].lang,
  }));

  readonly previewContent = computed<SafeHtml>(() => {
    const rawHtml = `
      <html>
        <head><style>${this.cssCode()}</style></head>
        <body>
          ${this.htmlCode()}
          <script>
            try { ${this.jsCode()} }
            catch (e) { document.body.innerHTML += '<pre style="color:red;">'+e+'</pre>'; }
          </script>
        </body>
      </html>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  });

  setEditorInstance(editor: Monaco.editor.IStandaloneCodeEditor): void {
    this.editorInstance = editor;
  }

  toggleFullscreen(): void {
    this.isFullscreen.update(v => !v);

    queueMicrotask(() => {
      this.editorInstance?.layout();
    });
  }

  updateActiveCode(value: string): void {
    this.tabMap[this.activeTabType()].code.set(value);
  }

  save(): void {
    const id = this.checkAuth('Error saving result');
    if (!id) return;

    this.loadingService.show();

    this.fetcher
      .saveData(id, this.htmlCode(), this.cssCode(), this.jsCode())
      .pipe(
        take(1),
        finalize(() => this.loadingService.hide())
      )

      .subscribe({
        next: () => {
          this.toastService.success('Success', 'You code saved');
        },
        error: error => {
          this.toastService.danger('Error saving result', error.message || 'Try again');
        },
      });
  }

  download(): void {
    const id = this.checkAuth('Error fetching data');
    if (!id) return;

    this.loadingService.show();

    this.fetcher
      .getData(id)
      .pipe(
        take(1),
        finalize(() => this.loadingService.hide())
      )
      .subscribe({
        next: data => {
          if (data) {
            this.htmlCode.set(data.html);
            this.cssCode.set(data.css);
            this.jsCode.set(data.js);
            this.toastService.success('Success', 'Data loaded successfully!');
          } else {
            this.toastService.warning('Attention', 'No saved data found.');
          }
        },
        error: err => {
          this.toastService.danger('Error fetching data', err.message || 'Try again');
        },
      });
  }

  private checkAuth(actionTitle: string): string | null {
    const id = this.userId();

    if (!id) {
      this.toastService.danger(actionTitle, 'Log in required to save or load code.');
      return null;
    }

    return id;
  }
}
