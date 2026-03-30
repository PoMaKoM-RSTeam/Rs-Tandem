import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { tndmAuthInterceptor } from '@auth';
import { provideMarkdown } from 'ngx-markdown';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { TitleStrategy } from '@angular/router';
import { TndmTitleStrategy } from './core/title-strategy/tndm-title-strategy';
import { translocoConfig } from './core/i18n/transloco.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tndmAuthInterceptor])),
    provideAngularSvgIcon(),
    provideMarkdown(),
    importProvidersFrom(
      MonacoEditorModule.forRoot({
        baseUrl: 'assets/monaco/vs',
      })
    ),
    { provide: TitleStrategy, useExisting: TndmTitleStrategy },
    ...translocoConfig,
  ],
};
