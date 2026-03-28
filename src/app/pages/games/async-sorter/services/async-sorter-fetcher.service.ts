import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../../../core/supabase/supabase-service';
import { PostgrestError } from '@supabase/supabase-js';

type GameStats = {
  seconds: number;
  moves: number;
  mistakes: number;
  movesBeforeFirstMistake: number;
};

@Injectable()
export class AsyncSorterFetcherService {
  private readonly supabase = inject(SupabaseService).client;

  async uploadGameStats(gameStats: GameStats): Promise<void | PostgrestError | Error> {
    const session = await this.supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    const { seconds, moves, mistakes, movesBeforeFirstMistake } = gameStats;
    try {
      const { error } = await this.supabase.from('async_sorter').insert([
        {
          user_id: userId,
          time_seconds: seconds,
          moves_count: moves,
          mistakes_count: mistakes,
          moves_before_first_mistake: movesBeforeFirstMistake,
        },
      ]);

      if (error) {
        return error;
      }
    } catch (error) {
      return error instanceof Error ? error : new Error(String(error));
    }
  }
}
