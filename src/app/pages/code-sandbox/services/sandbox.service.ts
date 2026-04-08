import { computed, inject, Injectable, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TndmAuthStateStoreService } from '@auth';
import { SandboxFetcherService } from './sandbox-fetcher.service';
import { DEFAULT_SANDBOX_CODE } from '../sandbox.constants';
import { EMPTY, finalize, Observable, tap } from 'rxjs';
import type * as Monaco from 'monaco-editor';
import { LoadingOverlayService } from '../../../core/loading-overlay/loading-overlay-service';
import { ToastService } from '../../../core/toast/toast-service';
import { SandboxResponse } from '../types/sandbox-response';

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

  save(): Observable<void> {
    const id = this.checkAuth('Error saving result');
    if (!id) return EMPTY;

    this.loadingService.show();

    return this.fetcher
      .saveData(id, this.htmlCode(), this.cssCode(), this.jsCode())
      .pipe(finalize(() => this.loadingService.hide()));
  }

  download(): Observable<SandboxResponse | undefined> {
    const id = this.checkAuth('Error fetching data');
    if (!id) return EMPTY;

    this.loadingService.show();

    return this.fetcher.getData(id).pipe(
      tap(data => {
        if (data) {
          this.htmlCode.set(data.html);
          this.cssCode.set(data.css);
          this.jsCode.set(data.js);
        }
      }),
      finalize(() => this.loadingService.hide())
    );
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
