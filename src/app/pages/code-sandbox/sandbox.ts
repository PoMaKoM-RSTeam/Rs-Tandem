import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';

type Tab = 'HTML' | 'CSS' | 'JS';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-sandbox',
  standalone: true,
  imports: [FormsModule, MatTabsModule, MatGridListModule, MonacoEditorModule],
  templateUrl: './sandbox.html',
  styleUrls: ['./sandbox.css'],
})
export class TndmSandbox {
  private sanitizer = inject(DomSanitizer);
  tabs: Tab[] = ['HTML', 'CSS', 'JS'];
  readonly selectedTab = signal<number>(0);

  readonly htmlCode = signal('<h1>Hello Angular Sandbox!</h1>');
  readonly cssCode = signal('h1 { color: #1976d2; font-family: sans-serif; }');
  readonly jsCode = signal('console.log("Hello from JS!");');

  editorOptions = {
    theme: 'vs-dark',
    automaticLayout: true,
  };

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

  getCode(tab: Tab): string {
    if (tab === 'HTML') {
      return this.htmlCode();
    }
    if (tab === 'CSS') {
      return this.cssCode();
    }
    return this.jsCode();
  }

  setCode(tab: Tab, value: string): void {
    if (tab === 'HTML') {
      this.htmlCode.set(value);
    } else if (tab === 'CSS') {
      this.cssCode.set(value);
    } else {
      this.jsCode.set(value);
    }
  }

  getLanguage(tab: Tab): string {
    if (tab === 'HTML') {
      return 'html';
    }
    if (tab === 'CSS') {
      return 'css';
    }
    return 'javascript';
  }

  onCodeChange(tab: Tab, value: string | unknown): void {
    if (typeof value === 'string') {
      this.setCode(tab, value);
    }
  }
}
