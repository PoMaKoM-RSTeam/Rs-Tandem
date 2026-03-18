import { Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class AsyncSorterFetcherService {
  private readonly supabaseUrl = environment.supabaseUrl;
  private readonly supabaseKey = environment.supabaseKey;

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async uploadGameTime(seconds: number): Promise<void> {
    const { error } = await this.supabase.from('async_sorter').insert([{ time_seconds: seconds }]);
    if (error) {
      console.error('Failed to upload game time to DB:', error);
    }
  }
}
