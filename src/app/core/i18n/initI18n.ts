import { inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Translation, TranslocoService } from '@jsverse/transloco';
import { isSupportedLang, STORAGE_KEY, SUPPORTED_LANGS, SupportedLang } from './language-preferences.service';

export function initI18n(): Promise<Translation> {
  const transloco: TranslocoService = inject(TranslocoService);

  let lang: SupportedLang = SUPPORTED_LANGS[0];

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (isSupportedLang(saved)) {
      lang = saved;
    }
  } catch {
    lang = SUPPORTED_LANGS[0];
  } finally {
    transloco.setActiveLang(lang);
  }

  return firstValueFrom(transloco.load(lang));
}
