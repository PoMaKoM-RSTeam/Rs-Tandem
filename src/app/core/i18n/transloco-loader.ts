import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { SupabaseService } from '../supabase/supabase-service';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, timeout } from 'rxjs';

const TRANSLATIONS_TABLE = 'rules';
const SUPABASE_TIMEOUT = 5000;

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);
  private readonly supabase: SupabaseClient = inject(SupabaseService).client;

  getTranslation(lang: string): Observable<Translation> {
    return forkJoin([this.loadFromJson(lang), this.loadFromSupabase(TRANSLATIONS_TABLE, lang, SUPABASE_TIMEOUT)]).pipe(
      map(([jsonTranslations, supabaseTranslations]) => ({
        ...jsonTranslations,
        ...supabaseTranslations,
      }))
    );
  }

  private loadFromJson(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`/i18n/${lang}.json`);
  }

  private loadFromSupabase(table: string, lang: string, timeoutTime: number): Observable<Translation> {
    return from(this.supabase.from(table).select('key, value').eq('lang', lang)).pipe(
      timeout(timeoutTime),
      map(({ data, error }) => {
        if (error || !data) return {};
        const translations: Translation = {};
        for (const row of data) {
          translations[row.key] = row.value;
        }
        return translations;
      }),
      catchError(() => of({}))
    );
  }
}
