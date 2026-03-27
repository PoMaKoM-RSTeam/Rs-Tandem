import { inject, Injectable, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TndmTitleStrategy extends TitleStrategy {
  readonly pageTitle = signal('code_forge');
  private title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const raw = this.buildTitle(snapshot);

    const formatted = raw ? raw.toLowerCase().replace(/[\s-]+/g, '_') : 'code_forge';

    this.pageTitle.set(formatted);
    this.title.setTitle(formatted);
  }
}
