import { Injectable } from '@angular/core';
import { Challenge } from '../types/challenge';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { GolfRank } from '../types/golf-rank';

@Injectable({ providedIn: 'root' })
export class CodeGolfFetcherService {
  private readonly supabaseUrl = 'https://bqfoaeuuwilliipmpovu.supabase.co';
  private readonly supabaseKey = 'sb_publishable_KXv3jOLT3TQj-ZqMbjPwLg_o8unxvBW';
  private readonly GET_CHALLENGE = 'get_localized_challenge';

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  async getRandomChallenge(lang: 'ru' | 'en' = 'en'): Promise<Challenge | null> {
     //TODO add checking data from DB
    const { data, error } = await this.supabase.rpc(this.GET_CHALLENGE, { lang });

    if (error) {
      console.error('Error fetching random challenge:', error);
      return null;
    }
    return data?.[0] ?? null;
  }

  async getGolfRanks(): Promise<GolfRank[]> {
    //TODO add checking data from DB
    const { data, error } = await this.supabase
      .from('code_golf_ranks')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      return [];
    }
    return data.map(rank => ({
      ...rank,
      maxBytes: rank.max_bytes === null ? Infinity : rank.max_bytes,
    }));
  }
}
