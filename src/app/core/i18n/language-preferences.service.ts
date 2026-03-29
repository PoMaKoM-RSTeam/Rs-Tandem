import { effect, inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { map } from 'rxjs';
import { SupabaseService } from '../supabase/supabase-service';
import { TndmAuthStateStoreService } from '@auth';
import { SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY = 'tndm_lang';
const TABLE = 'user_preferences';

export type SupportedLang = 'en' | 'ru';

@Injectable({ providedIn: 'root' })
export class LanguagePreferenceService {
  private readonly transloco = inject(TranslocoService);
  private readonly supabase: SupabaseClient = inject(SupabaseService).client;
  private readonly authStore = inject(TndmAuthStateStoreService);

  private readonly defaultLang: SupportedLang = 'en';

  readonly activeLang = toSignal(
    this.transloco.langChanges$.pipe(map(lang => (lang === 'en' || lang === 'ru' ? lang : this.defaultLang))),
    { initialValue: this.defaultLang }
  );

  constructor() {
    const saved = this.getFromStorage();
    if (saved) {
      this.transloco.setActiveLang(saved);
    }

    effect(() => {
      const user = this.authStore.user();
      if (user) {
        this.loadFromServer(user.id);
      }
    });
  }

  setLang(lang: SupportedLang): void {
    this.transloco.setActiveLang(lang);
    this.saveToStorage(lang);

    const userId = this.authStore.user()?.id;
    if (userId) {
      this.saveToServer(userId, lang);
    }
  }

  private getFromStorage(): SupportedLang | null {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return value === 'en' || value === 'ru' ? value : null;
    } catch {
      return null;
    }
  }

  private saveToStorage(lang: SupportedLang): void {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.warn('Error on save', error);
    }
  }

  private async loadFromServer(userId: string): Promise<void> {
    try {
      const { data, error } = await this.supabase.from(TABLE).select('lang').eq('user_id', userId).maybeSingle();
      if (error || !data) return;
      const lang = data.lang;
      if (lang === 'en' || lang === 'ru') {
        this.transloco.setActiveLang(lang);
        this.saveToStorage(lang);
      }
    } catch (error) {
      console.error('Data saved but not loaded', error);
    }
  }

  private async saveToServer(userId: string, lang: SupportedLang): Promise<void> {
    await this.supabase.from(TABLE).upsert({ user_id: userId, lang }, { onConflict: 'user_id' });
  }
}
