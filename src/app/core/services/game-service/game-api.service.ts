import { inject, Injectable } from '@angular/core';
import { SupabaseService } from '../../supabase/supabase-service';
import { DatabaseRecordRow, GlobalRecord } from './game-service.types';

@Injectable({ providedIn: 'root' })
export class GameApiService {
  private readonly supabaseClient = inject(SupabaseService).client;

  async updateResult(gameId: string, levelNumber: number, score: number, xp: number): Promise<void> {
    const { error } = await this.supabaseClient.rpc('submit_game_result', {
      p_game_id: gameId,
      p_level_number: levelNumber,
      p_score: score,
      p_xp_reward: xp,
    });

    if (error) {
      throw new Error(`Update error: ${error.message}`);
    }
  }

  async getLevelBestResult(gameId: string, levelNumber: number): Promise<number | null> {
    const { data, error } = await this.supabaseClient
      .from('user_best_results')
      .select('best_score')
      .match({ game_id: gameId, level_number: levelNumber })
      .maybeSingle();

    if (error) {
      console.error('Failed to load level record:', error.message);
      return null;
    }
    return data?.best_score ?? null;
  }

  async getGlobalLevelLeader(gameId: string, levelNumber: number): Promise<GlobalRecord | null> {
    const { data, error } = await this.supabaseClient
      .from('user_best_results')
      .select(`best_score, updated_at, user_stats!inner (display_name)`)
      .match({ game_id: gameId, level_number: levelNumber })
      .order('best_score', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      if (error) {
        console.error('Leaderboard error:', error.message);
      }
      return null;
    }

    return this.mapToGlobalRecord(data as unknown as DatabaseRecordRow);
  }

  async getLevelLeaderboard(gameId: string, levelNumber: number, limit = 10): Promise<GlobalRecord[]> {
    const { data, error } = await this.supabaseClient
      .from('user_best_results')
      .select(`best_score, updated_at, user_stats!inner (display_name)`)
      .match({ game_id: gameId, level_number: levelNumber })
      .order('best_score', { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return (data as unknown as DatabaseRecordRow[]).map(row => this.mapToGlobalRecord(row));
  }

  private mapToGlobalRecord(row: DatabaseRecordRow): GlobalRecord {
    const stats = Array.isArray(row.user_stats) ? row.user_stats[0] : row.user_stats;
    return {
      bestScore: row.best_score,
      updatedAt: row.updated_at,
      userName: stats?.display_name || 'Anonymous',
    };
  }
}
