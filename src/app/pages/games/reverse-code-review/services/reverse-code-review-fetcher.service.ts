import { inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from '../../../../core/supabase/supabase-service';
import { CaseDifficulty } from '../models/review-case.model';

export type CaseCompletionRow = {
  case_id: string;
  difficulty: CaseDifficulty;
  score: number;
  max_score: number;
  solved_at: string;
};

@Injectable({ providedIn: 'root' })
export class ReverseCodeReviewFetcherService {
  private readonly supabase: SupabaseClient = inject(SupabaseService).client;
  private readonly TABLE = 'test_reverse_code_review' as const;

  async getCompletedCases(userId: string): Promise<CaseCompletionRow[]> {
    const { data, error } = await this.supabase
      .from(this.TABLE)
      .select('case_id, difficulty, score, max_score, solved_at')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }
    return (data as CaseCompletionRow[] | null) ?? [];
  }

  async saveCaseCompletion(
    userId: string,
    caseId: string,
    difficulty: CaseDifficulty,
    score: number,
    maxScore: number
  ): Promise<void> {
    const { error } = await this.supabase.from(this.TABLE).upsert(
      {
        user_id: userId,
        case_id: caseId,
        difficulty,
        score,
        max_score: maxScore,
        solved_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,case_id' }
    );

    if (error) {
      throw error;
    }
  }
}
