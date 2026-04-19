import { effect, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { map } from 'rxjs';
import { SupabaseService } from '../supabase/supabase-service';
import { TndmAuthStateStoreService } from '@auth';
import { SupabaseClient } from '@supabase/supabase-js';
import { ToastService } from '../toast/toast-service';
import { LoadingOverlayService } from '../loading-overlay/loading-overlay-service';

export const STORAGE_KEY = 'tndm_lang';
const TABLE = 'user_preferences';

export type SupportedLang = 'en' | 'ru';

export const SUPPORTED_LANGS: SupportedLang[] = ['en', 'ru'];

export function isSupportedLang(value: unknown): value is SupportedLang {
  return (SUPPORTED_LANGS as unknown[]).includes(value);
}

@Injectable({ providedIn: 'root' })
export class LanguagePreferenceService {
  private readonly transloco = inject(TranslocoService);
  private readonly supabase: SupabaseClient = inject(SupabaseService).client;
  private readonly authStore = inject(TndmAuthStateStoreService);
  private readonly toastService = inject(ToastService);
  private readonly loadingOverlay = inject(LoadingOverlayService);

  private readonly defaultLang: SupportedLang = SUPPORTED_LANGS[0];
  private loadedForUserId: string | null = null;

  readonly activeLang = toSignal(
    this.transloco.langChanges$.pipe(map(lang => (isSupportedLang(lang) ? lang : this.defaultLang))),
    { initialValue: this.defaultLang }
  );

  constructor() {
    effect(() => {
      const user = this.authStore.user();
      if (user) {
        void this.loadLangPreference(user.id);
      }
    });
  }

  setLang(lang: SupportedLang): void {
    this.transloco.setActiveLang(lang);
    this.saveToStorage(lang);

    const userId = this.authStore.user()?.id;
    if (userId) {
      void this.saveLangPreference(userId, lang);
    }
  }

  private saveToStorage(lang: SupportedLang): void {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      this.toastService.warning(
        this.transloco.translate('language-preferences-toaster.error'),
        this.transloco.translate('language-preferences-toaster.languageErrorLocalStorage')
      );
    }
  }

  private async loadLangPreference(userId: string): Promise<void> {
    if (this.loadedForUserId === userId) {
      return;
    }

    this.loadingOverlay.show();
    try {
      const { data, error } = await this.supabase.from(TABLE).select('lang').eq('user_id', userId).maybeSingle();
      if (error || !data) return;

      this.loadedForUserId = userId;
      const lang = data.lang;
      if (isSupportedLang(lang)) {
        this.transloco.setActiveLang(lang);
        this.saveToStorage(lang);
        this.toastService.warning(
          this.transloco.translate('language-preferences-toaster.error'),
          this.transloco.translate('language-preferences-toaster.languageErrorLocalStorage')
        );
      }
    } catch {
      this.loadedForUserId = null;
      this.toastService.warning(
        this.transloco.translate('language-preferences-toaster.error'),
        this.transloco.translate('language-preferences-toaster.languageErrorLoadServer')
      );
    } finally {
      this.loadingOverlay.hide();
    }
  }

  private async saveLangPreference(userId: string, lang: SupportedLang): Promise<void> {
    try {
      await this.supabase.from(TABLE).upsert({ user_id: userId, lang }, { onConflict: 'user_id' });
    } catch {
      this.toastService.warning(
        this.transloco.translate('language-preferences-toaster.error'),
        this.transloco.translate('language-preferences-toaster.languageErrorSaveServer')
      );
    }
  }

  resetLang(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.loadedForUserId = null;
    this.transloco.setActiveLang(this.defaultLang);
  }
}
