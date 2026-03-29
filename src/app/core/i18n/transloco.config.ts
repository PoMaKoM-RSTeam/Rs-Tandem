import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';

export const translocoConfig: ApplicationConfig['providers'] = [
  provideTransloco({
    config: {
      availableLangs: ['en', 'ru'],
      defaultLang: 'en',
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
    },
    loader: TranslocoHttpLoader,
  }),
];
