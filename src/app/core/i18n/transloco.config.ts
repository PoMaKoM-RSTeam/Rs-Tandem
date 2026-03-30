import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideTransloco } from '@jsverse/transloco';
import { TranslocoHttpLoader } from './transloco-loader';
import { SUPPORTED_LANGS } from './language-preferences.service';

export const translocoConfig: ApplicationConfig['providers'] = [
  provideTransloco({
    config: {
      availableLangs: [...SUPPORTED_LANGS],
      defaultLang: SUPPORTED_LANGS[0],
      reRenderOnLangChange: true,
      prodMode: !isDevMode(),
    },
    loader: TranslocoHttpLoader,
  }),
];
