import { inject, Injectable } from '@angular/core';
import { Challenge } from '../types/challenge';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GolfRank } from '../types/golf-rank';
import { catchError, from, map, Observable, of } from 'rxjs';
import { ToastService } from '../../../../core/toast/toast-service';

@Injectable({ providedIn: 'root' })
export class CodeGolfFetcherService {
  private readonly supabaseUrl = 'https://bqfoaeuuwilliipmpovu.supabase.co';
  private readonly supabaseKey = 'sb_publishable_KXv3jOLT3TQj-ZqMbjPwLg_o8unxvBW';
  private readonly GET_CHALLENGE = 'get_random_challenge';
  private readonly SAVE_CHALLENGE = 'save_golf_result';
  private readonly GET_RANKS = 'get_golf_ranks';
  private readonly toastService = inject(ToastService);

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  getRandomChallenge(lang: 'ru' | 'en' = 'en'): Observable<Challenge | undefined> {
    return from(this.supabase.rpc(this.GET_CHALLENGE, { lang_code: lang })).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return data?.[0];
      }),
      catchError(() => {
        this.toastService.danger('Oops, something went wrong!', `Please refresh the page or try again later.`);
        return of(undefined);
      })
    );
  }

  getGolfRanks(): Observable<GolfRank[]> {
    return from(this.supabase.rpc(this.GET_RANKS)).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return data ?? [];
      }),
      catchError(() => {
        this.toastService.danger('Oops, something went wrong!', `Please refresh the page or try again later.`);
        return of([]);
      })
    );
  }

  saveResult(challengeKey: string, userId: string, bytes: number): Observable<void> {
    return from(
      this.supabase.rpc(this.SAVE_CHALLENGE, {
        p_challenge_key: challengeKey,
        p_user_id: userId,
        p_byte_count: bytes,
      })
    ).pipe(
      map(({ error }) => {
        if (error) {
          throw error;
        }
        return;
      }),
      catchError(error => {
        this.toastService.danger('Error saving result', error.message);
        throw error;
      })
    );
  }
}
