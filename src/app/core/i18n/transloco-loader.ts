import { inject, Injectable } from '@angular/core';
import { Translation, TranslocoLoader } from '@jsverse/transloco';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, map, Observable, of } from 'rxjs';
import { SupabaseService } from '../supabase/supabase-service';
import { SupabaseClient } from '@supabase/supabase-js';

const TRANSLATIONS_TABLE = 'rules';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  private readonly http = inject(HttpClient);
  private readonly supabase: SupabaseClient = inject(SupabaseService).client;

  getTranslation(lang: string): Observable<Translation> {
    return forkJoin([this.loadFromJson(lang), this.loadFromSupabase(lang)]).pipe(
      map(([jsonTranslations, supabaseTranslations]) => ({
        ...jsonTranslations,
        ...supabaseTranslations,
      }))
    );
  }

  private loadFromJson(lang: string): Observable<Translation> {
    return this.http.get<Translation>(`/i18n/${lang}.json`);
  }

  private loadFromSupabase(lang: string): Observable<Translation> {
    return new Observable<Translation>(subscriber => {
      this.supabase
        .from(TRANSLATIONS_TABLE)
        .select('key, value')
        .eq('lang', lang)
        .then(({ data, error }) => {
          if (error || !data) {
            subscriber.next({});
          } else {
            const translations: Translation = {};
            for (const row of data) {
              translations[row.key] = row.value;
            }
            subscriber.next(translations);
          }
          subscriber.complete();
        });
    }).pipe(catchError(() => of({})));
  }
}
