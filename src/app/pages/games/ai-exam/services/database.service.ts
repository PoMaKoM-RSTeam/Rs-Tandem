import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../../../core/supabase/supabase-service';
import { PostgrestError } from '@supabase/supabase-js';

type ExamResults = {
  attemptsUsed: number;
  maxAllowedAttempts: number;
  question: string | null;
  isExamPassed: boolean;
  score: number;
};

@Injectable()
export class AiExamDatabaseService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly TABLE_NAME = 'ai_exam';

  async uploadExamResults(examResults: ExamResults): Promise<void | PostgrestError | Error> {
    const session = await this.supabase.auth.getSession();
    const userId = session.data.session?.user.id;

    const { attemptsUsed, question, maxAllowedAttempts, isExamPassed, score } = examResults;
    try {
      const { error } = await this.supabase.from(this.TABLE_NAME).insert([
        {
          user_id: userId,
          attempts_used: attemptsUsed,
          max_allowed_attempts: maxAllowedAttempts,
          question,
          is_exam_passed: isExamPassed,
          score,
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
