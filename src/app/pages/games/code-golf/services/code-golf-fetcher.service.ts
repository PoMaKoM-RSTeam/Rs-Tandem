import { Injectable } from '@angular/core';
import { Challenge } from '../types/challenge';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GolfRank } from '../types/golf-rank';
import { catchError, from, map, Observable, of } from 'rxjs';

@Injectable()
export class CodeGolfFetcherService {
  private readonly SUPABASE_URL = 'https://bqfoaeuuwilliipmpovu.supabase.co';
  private readonly SUPABASE_KEY = 'sb_publishable_KXv3jOLT3TQj-ZqMbjPwLg_o8unxvBW';
  private readonly RPC_FUNCTIONS = {
    GET_RANDOM_CHALLENGE: 'get_random_challenge',
    GET_CHALLENGE_BY_ID: 'get_challenge_by_id',
    GET_USER_CHALLENGE_RESULT: 'get_user_golf_result',
    SAVE_CHALLENGE: 'save_golf_result',
    GET_RANKS: 'get_golf_ranks',
  } as const;

  private readonly supabase: SupabaseClient = createClient(this.SUPABASE_URL, this.SUPABASE_KEY);

  getRandomChallenge(lang: 'ru' | 'en' = 'en'): Observable<Challenge | undefined> {
    return this.callRpc<Challenge[]>(this.RPC_FUNCTIONS.GET_RANDOM_CHALLENGE, { lang_code: lang }).pipe(
      map(data => data?.[0])
    );
  }

  getChallengeById(lang: 'ru' | 'en', challengeKey: string): Observable<Challenge | undefined> {
    return this.callRpc<Challenge[]>(this.RPC_FUNCTIONS.GET_CHALLENGE_BY_ID, {
      lang_code: lang,
      p_challenge_key: challengeKey,
    }).pipe(map((data: Challenge[]): Challenge | undefined => (data?.length > 0 ? data[0] : undefined)));
  }

  getUserChallengeResult(challengeKey: string, userId: string): Observable<number | null> {
    if (!challengeKey || !userId) {
      return of(null);
    }

    return this.callRpc<number>(this.RPC_FUNCTIONS.GET_USER_CHALLENGE_RESULT, {
      challengekey: challengeKey,
      userid: userId,
    }).pipe(
      map(data => data ?? null),
      catchError(() => of(null))
    );
  }

  getGolfRanks(): Observable<GolfRank[]> {
    return this.callRpc<GolfRank[]>(this.RPC_FUNCTIONS.GET_RANKS).pipe(map(data => data ?? []));
  }

  saveResult(challengeKey: string, userId: string, bytes: number): Observable<number> {
    return this.callRpc<number>(this.RPC_FUNCTIONS.SAVE_CHALLENGE, {
      p_challenge_key: challengeKey,
      p_user_id: userId,
      p_byte_count: bytes,
    });
  }

  private callRpc<T>(fn: string, params?: Record<string, unknown>): Observable<T> {
    return from(this.supabase.rpc(fn, params)).pipe(
      map(({ data, error }) => {
        if (error) {
          //Logging
          throw error;
        }
        return data as T;
      })
    );
  }
}
