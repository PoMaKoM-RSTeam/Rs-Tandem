import { computed, inject, Injectable, signal } from '@angular/core';
import { TndmAuthStateStoreService } from '@auth';
import { SandboxFetcherService } from './sandbox-fetcher.service';
import { DEFAULT_SANDBOX_CODE } from '../sandbox.constants';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ToastService } from '../../../core/services/toast/toast-service';

type Tab = 'HTML' | 'CSS' | 'JS';

@Injectable({ providedIn: 'root' })
export class SabdboxService {
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
    console.log('save');
    //  console.log(this.sandboxResource.value());
  }

  download(): void {
    console.log('download');
    //  console.log(this.sandboxResource.value());
  }
}
