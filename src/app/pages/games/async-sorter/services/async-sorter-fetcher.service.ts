import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../../../core/supabase/supabase-service';

@Injectable({ providedIn: 'root' })
export class AsyncSorterFetcherService {
  private readonly supabase = inject(SupabaseService).client;

  async uploadGameStats(seconds: number, moves: number): Promise<void> {
    const { error } = await this.supabase.from('async_sorter').insert([{ time_seconds: seconds, moves_count: moves }]);
    if (error) {
      console.error('Failed to upload game time to DB:', error);
    }
  }
}
