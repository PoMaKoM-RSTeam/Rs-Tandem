import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { LanguagePreferenceService, SupportedLang } from '../../../core/i18n/language-preferences.service';

@Component({
  selector: 'tndm-lang-switcher',
  templateUrl: 'tndm-language-switcher.html',
  styleUrl: 'tndm-language-switcher.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmLangSwitcher {
  private readonly langService = inject(LanguagePreferenceService);

  readonly activeLang = this.langService.activeLang;
  readonly isRu = computed(() => this.activeLang() === 'ru');

  switchLang(lang: SupportedLang): void {
    this.langService.setLang(lang);
  }
}
