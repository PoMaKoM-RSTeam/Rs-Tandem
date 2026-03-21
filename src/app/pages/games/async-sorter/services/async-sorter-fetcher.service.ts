import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../../../core/supabase/supabase-service';

type GameStats = {
  seconds: number;
  moves: number;
  mistakes: number;
  movesBeforeFirstMistake: number;
};

@Injectable()
export class AsyncSorterFetcherService {
  private readonly supabase = inject(SupabaseService).client;

  async uploadGameStats(gameStats: GameStats): Promise<void> {
    const { seconds, moves, mistakes, movesBeforeFirstMistake } = gameStats;

    const { error } = await this.supabase.from('async_sorter').insert([
      {
        time_seconds: seconds,
        moves_count: moves,
        mistakes_count: mistakes,
        moves_before_first_mistake: movesBeforeFirstMistake,
      },
    ]);

    if (error) {
      console.error('Failed to upload game time to DB:', error);
    }
  }
}
