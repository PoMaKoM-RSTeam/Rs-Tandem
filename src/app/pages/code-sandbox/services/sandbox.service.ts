import { computed, inject, Injectable, signal } from '@angular/core';
import { TndmAuthStateStoreService } from '@auth';
import { SandboxFetcherService } from './sandbox-fetcher.service';
import { DEFAULT_SANDBOX_CODE } from '../sandbox.constants';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastService } from '../../../core/services/toast/toast-service';
import { take } from 'rxjs';

type Tab = 'HTML' | 'CSS' | 'JS';

@Injectable({ providedIn: 'root' })
export class SandboxService {
  private readonly fetcher = inject(SandboxFetcherService);
  private readonly authStore = inject(TndmAuthStateStoreService);
  private readonly toastService = inject(ToastService);
  private sanitizer = inject(DomSanitizer);

  readonly htmlCode = signal(DEFAULT_SANDBOX_CODE.html);
  readonly cssCode = signal(DEFAULT_SANDBOX_CODE.css);
  readonly jsCode = signal(DEFAULT_SANDBOX_CODE.javascript);
  readonly isFullscreen = signal(false);

  readonly userId = computed(() => this.authStore.user()?.id);

  readonly tabs: Tab[] = ['HTML', 'CSS', 'JS'];
  readonly selectedTab = signal<number>(0);

  readonly activeTabType = computed(() => this.tabs[this.selectedTab()]);

  readonly tabMap = {
    HTML: { code: this.htmlCode, lang: 'html' },
    CSS: { code: this.cssCode, lang: 'css' },
    JS: { code: this.jsCode, lang: 'javascript' },
  } as const;

  readonly activeCode = computed(() => this.tabMap[this.activeTabType()].code());

  readonly editorOptions = {
    theme: 'vs',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
  };

  readonly activeEditorOptions = computed(() => ({
    ...this.editorOptions,
    language: this.tabMap[this.activeTabType()].lang,
  }));

  updateActiveCode(value: string): void {
    this.tabMap[this.activeTabType()].code.set(value);
  }

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

  save(): void {
    const id = this.userId();
    if (id) {
      this.fetcher
        .saveData(id, this.htmlCode(), this.cssCode(), this.jsCode())
        .pipe(take(1))
        .subscribe({
          next: () => {
            this.toastService.success('Success', 'You result saved');
          },
          error: err => {
            this.toastService.danger('Ошибка при сохранении', err.message);
          },
        });
    }
  }

  download(): void {
    const id = this.userId();
    if (id) {
      this.fetcher
        .getData(id)
        .pipe(take(1))
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
  }
}
