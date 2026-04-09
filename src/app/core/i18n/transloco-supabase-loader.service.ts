import { inject, Injectable } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../supabase/supabase-service';

@Injectable({ providedIn: 'root' })
export class TndmTranslocoSupabaseLoader {
  private readonly supabase: SupabaseClient = inject(SupabaseService).client;
  private readonly transloco = inject(TranslocoService);
  private readonly cache = new Map<string, string>();

  async getTable(gameKey: string, table = 'rules'): Promise<string> {
    const lang = this.transloco.getActiveLang();
    const cacheKey = `${table}:${gameKey}:${lang}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const { data, error } = await this.supabase
      .from(table)
      .select('value')
      .eq('key', gameKey)
      .eq('lang', lang)
      .maybeSingle();

    const value = !error && data ? data.value : '';
    this.cache.set(cacheKey, value);
    return value;
  }
}
