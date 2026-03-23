import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { tndmAuthInterceptor } from '@auth';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tndmAuthInterceptor])),
    provideAngularSvgIcon(),
     importProvidersFrom(
      MonacoEditorModule.forRoot({
        baseUrl: 'assets/monaco/vs'
      })
    )
  ],
};
