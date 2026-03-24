import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { DEFAULT_SANDBOX_CODE } from './sandbox.constants';

type Tab = 'HTML' | 'CSS' | 'JS';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-sandbox',
  standalone: true,
  imports: [FormsModule, MatTabsModule, MonacoEditorModule],
  templateUrl: './sandbox.html',
  styleUrls: ['./sandbox.scss'],
})
export class TndmSandbox {
  private sanitizer = inject(DomSanitizer);

  readonly tabs: Tab[] = ['HTML', 'CSS', 'JS'];
  readonly selectedTab = signal<number>(0);

  readonly htmlCode = signal(DEFAULT_SANDBOX_CODE.html);
  readonly cssCode = signal(DEFAULT_SANDBOX_CODE.css);
  readonly jsCode = signal(DEFAULT_SANDBOX_CODE.javascript);

  readonly tabConfig = {
    HTML: { code: this.htmlCode, lang: 'html' },
    CSS: { code: this.cssCode, lang: 'css' },
    JS: { code: this.jsCode, lang: 'javascript' },
  } as const;

  readonly editorOptions = {
    theme: 'vs',
    automaticLayout: true,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
  };

  readonly editorConfigs = computed(() => ({
    HTML: { ...this.editorOptions, language: this.tabConfig.HTML.lang },
    CSS: { ...this.editorOptions, language: this.tabConfig.CSS.lang },
    JS: { ...this.editorOptions, language: this.tabConfig.JS.lang },
  }));

  readonly previewContent = computed<SafeHtml>(() => {
    const rawHtml = `
      <html>
        <head>
          <style>${this.cssCode()}</style>
        </head>
        <body>
          ${this.htmlCode()}
          <script>
            try {
              ${this.jsCode()}
            } catch (e) {
              document.body.innerHTML += '<pre style="color:red;">'+e+'</pre>';
            }
          </script>
        </body>
      </html>
    `;
    return this.sanitizer.bypassSecurityTrustHtml(rawHtml);
  });
}
