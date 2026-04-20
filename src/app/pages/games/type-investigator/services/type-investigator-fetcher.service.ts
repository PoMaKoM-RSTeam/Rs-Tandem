import { inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../../../../core/supabase/supabase-service';
import { PuzzleDifficulty } from '../models/puzzle-difficulty.enum';

export type PuzzleCompletionRow = {
  puzzle_id: string;
  difficulty: PuzzleDifficulty;
  solved_at: string;
};

@Injectable({ providedIn: 'root' })
export class TypeInvestigatorFetcherService {
  private readonly supabase: SupabaseClient = inject(SupabaseService).client;
  private readonly TABLE = 'test_type_investigator' as const;

  async getCompletedPuzzles(userId: string): Promise<PuzzleCompletionRow[]> {
    const { data, error } = await this.supabase
      .from(this.TABLE)
      .select('puzzle_id, difficulty, solved_at')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
    return (data as PuzzleCompletionRow[] | null) ?? [];
  }

  async savePuzzleCompletion(userId: string, puzzleId: string, difficulty: PuzzleDifficulty): Promise<void> {
    const { error } = await this.supabase.from(this.TABLE).upsert(
      {
        user_id: userId,
        puzzle_id: puzzleId,
        difficulty,
        solved_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,puzzle_id' }
    );

    if (error) {
      throw error;
    }
  }
}
