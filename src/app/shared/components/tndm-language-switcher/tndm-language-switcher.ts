import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  LanguagePreferenceService,
  SUPPORTED_LANGS,
  SupportedLang,
} from '../../../core/i18n/language-preferences.service';

@Component({
  selector: 'tndm-lang-switcher',
  templateUrl: 'tndm-language-switcher.html',
  styleUrl: 'tndm-language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmLangSwitcher {
  private readonly langService = inject(LanguagePreferenceService);

  readonly activeLang = this.langService.activeLang;
  readonly languages = SUPPORTED_LANGS;

  switchLang(lang: SupportedLang): void {
    this.langService.setLang(lang);
  }
}
