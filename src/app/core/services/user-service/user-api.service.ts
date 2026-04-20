import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from '../../supabase/supabase-service';
import { ToastService } from '../../toast/toast-service';
import { DatabaseUserFullProfileRow, User, UserActivityHub, UserProfile } from './user-api-service.types';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly supabase = inject(SupabaseService).client;
  private readonly toast = inject(ToastService);

  private readonly _profile = signal<UserProfile | null>(null);
  private readonly _context = signal<User | null>(null);

  readonly profile = this._profile.asReadonly();
  readonly context = this._context.asReadonly();

  async loadUserSession(): Promise<void> {
    const [statsRes, context] = await Promise.all([this.supabase.rpc('sync_user_session'), this.getUser()]);

    if (statsRes.data) {
      this._profile.set(this.mapToUserProfile(statsRes.data));
    }

    if (context) {
      this._context.set(context);
    }

    if (statsRes.error) {
      this.toast.danger('Sync Error', statsRes.error.message);
    }
  }

  async getUser(): Promise<User | null> {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) {
      this.toast.danger('Failure', 'failed to get user info');
      return null;
    }

    const { data: profile } = await this.supabase
      .from('user_profile')
      .select('display_name, avatar_url, bio')
      .eq('id', user.id)
      .single();

    return {
      id: user.id,
      email: user.email,
      displayName: profile?.display_name ?? 'Gamer',
      avatarUrl: profile?.avatar_url ?? user.user_metadata['avatar_url'] ?? null,
      bio: profile?.bio ?? null,
    };
  }

  async updateUserInfo(updates: {
    displayName?: string;
    avatarUrl?: string;
    bio?: string;
    password?: string;
  }): Promise<void> {
    const user = this._context();
    if (!user) return;

    const dbPayload: Record<string, string | null> = {};
    if (updates.displayName) dbPayload['display_name'] = updates.displayName;
    if (updates.avatarUrl) dbPayload['avatar_url'] = updates.avatarUrl;
    if (updates.bio !== undefined) dbPayload['bio'] = updates.bio;

    if (Object.keys(dbPayload).length > 0) {
      const { error: dbError } = await this.supabase.from('user_profile').update(dbPayload).eq('id', user.id);

      if (dbError) throw dbError;

      if (updates.displayName) this.toast.success('Success', 'Username updated');
      if (updates.bio !== undefined) this.toast.success('Success', 'Bio updated');
    }

    const authPayload: { data?: { display_name: string }; password?: string } = {};
    if (updates.displayName) authPayload.data = { display_name: updates.displayName };
    if (updates.password) authPayload.password = updates.password;

    if (Object.keys(authPayload).length > 0) {
      const { error: authError } = await this.supabase.auth.updateUser(authPayload);

      if (authError) throw authError;

      if (updates.password) {
        this.toast.success('Success', 'Password changed successfully');
      }
    }

    this._context.update(prev => (prev ? { ...prev, ...updates } : null));

    if (updates.displayName) {
      this._profile.update(prev => (prev ? { ...prev, displayName: updates.displayName! } : null));
    }
  }

  async updateEmail(email: string): Promise<void> {
    return this.supabase.auth.updateUser({ email }).then(({ error }) => {
      if (error) throw error;
      this.toast.info('Verification sent', 'Check your inbox');
    });
  }

  async getActivityHub(): Promise<UserActivityHub | null> {
    const { data, error } = await this.supabase.rpc('get_user_activity_hub');

    if (error) {
      this.toast.danger('Error fetching activity hub:', error.message);
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
