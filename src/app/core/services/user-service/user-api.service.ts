import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../../supabase/supabase-service';
import { DatabaseUserFullProfileRow, UserActivityHub, UserProfile } from './user-api-service.types';
import { ToastService } from '../../toast/toast-service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly supabaseClient = inject(SupabaseService).client;
  private readonly toastService = inject(ToastService);

  private readonly profileSignal = signal<UserProfile | null>(null);

  readonly profile = this.profileSignal.asReadonly();

  async loadUserSession(): Promise<void> {
    const { data, error } = await this.supabaseClient.rpc('sync_user_session');

    if (error) {
      this.toastService.danger('Session Sync Error', error.message);
      return;
    }

    if (data) {
      this.profileSignal.set(this.mapToUserProfile(data));
    }
  }

  async updateDisplayName(newName: string): Promise<void> {
    const user = this.profile();
    if (!user) {
      return;
    }

    const { error } = await this.supabaseClient
      .from('user_stats')
      .update({ display_name: newName })
      .eq('user_id', user.userId);

    if (error) {
      this.toastService.danger('Failed to update name', error.message);
      throw new Error(error.message);
    }

    this.profileSignal.update(curr => (curr ? { ...curr, displayName: newName } : null));
  }

  async getActivityHub(): Promise<UserActivityHub | null> {
    const { data, error } = await this.supabaseClient.rpc('get_user_activity_hub');

    if (error) {
      console.error('RPC Error:', error);
      this.toastService.danger('Failed to get activity statistics', error.message);
      return null;
    }

    return data;
  }

  private mapToUserProfile(data: DatabaseUserFullProfileRow): UserProfile {
    return {
      userId: data.user_id,
      displayName: data.display_name,
      totalXp: data.total_xp,
      totalCompletedLevels: data.total_completed_levels,
      currentStreak: data.current_streak,
      maxStreak: data.max_streak,
      globalRankPosition: data.leaderboard_position,
      rank: {
        name: data.rank_name,
        minXp: data.rank_min_xp,
        maxXp: data.rank_max_xp,
        nextRankName: data.next_rank_name,
      },
    };
  }
}
