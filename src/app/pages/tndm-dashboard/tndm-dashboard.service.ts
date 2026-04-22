import { computed, inject, Injectable, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { UserService } from '../../core/services/user-service/user-api.service';
import { GameApiService } from '../../core/services/game-service/game-api.service';
import { LoadingOverlayService } from '../../core/loading-overlay/loading-overlay-service';
import { GamesProgressData, LeaderboardEntry } from '../../core/services/game-service/game-service.types';
import { UserActivityHub } from '../../core/services/user-service/user-api-service.types';
import { ToastService } from '../../core/toast/toast-service';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly userService = inject(UserService);
  private readonly gameService = inject(GameApiService);
  private readonly loadingService = inject(LoadingOverlayService);
  private readonly toast = inject(ToastService);
  private readonly transloco = inject(TranslocoService);

  private readonly _leaderboard = signal<LeaderboardEntry[]>([]);
  readonly leaderboard = this._leaderboard.asReadonly();

  private readonly _gamesProgress = signal<GamesProgressData[] | null>(null);
  private readonly _streakData = signal<UserActivityHub | null>(null);

  private readonly t = toSignal(this.transloco.selectTranslateObject<Record<string, string>>('dashboard'));
  private readonly tRanks = toSignal(this.transloco.selectTranslateObject<Record<string, string>>('ranks'));

  readonly streakData = this._streakData.asReadonly();
  readonly userProfile = this.userService.profile;

  readonly userProgress = computed(() => {
    const profile = this.userProfile();
    const ranks = this.tRanks();

    if (!profile?.rank) {
      return { current: 0, max: 100, rankName: ranks?.['junior'] ?? '...' };
    }

    const { rank, totalXp } = profile;
    const rankKey = rank.name?.toLowerCase() ?? 'noRank';

    return {
      current: Math.max(0, (totalXp ?? 0) - (rank.minXp ?? 0)),
      max: (rank.maxXp ?? 0) - (rank.minXp ?? 0) || 100,
      rankName: ranks?.[rankKey] ?? rank.name,
    };
  });

  readonly playerStats = computed(() => {
    const profile = this.userProfile();
    const labels = this.t();

    if (!profile || !labels) return [];

    return [
      { label: labels['rank'], value: profile.rank?.name ?? '—' },
      { label: labels['totalCompleted'], value: String(profile.totalCompletedLevels) },
      { label: labels['position'], value: `#${profile.globalRankPosition}` },
      { label: labels['totalXp'], value: String(profile.totalXp) },
    ];
  });

  readonly gamesProgresses = computed(() => {
    const games = this._gamesProgress();
    const labels = this.t();

    if (!games || !labels) return [];

    return games.map(game => ({
      title: game.title,
      current: game.completed_levels_count,
      max: game.total_levels,
      stats: [
        { label: labels['lvl'], value: `${game.completed_levels_count}/${game.total_levels}` },
        { label: labels['totalScore'], value: String(game.total_game_xp) },
        { label: labels['position'], value: `#${game.game_rank_position}` },
      ],
    }));
  });

  async initDashboard(): Promise<void> {
    this.loadingService.show();
    try {
      await this.userService.loadUserSession();

      const [activity, games, leaders] = await Promise.all([
        this.userService.getActivityHub(),
        this.gameService.getGamesProgress(),
        this.gameService.getLeaderboard(10),
      ]);

      this._streakData.set(activity);
      this._gamesProgress.set(games);
      this._leaderboard.set(leaders);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'please try again';
      this.toast.danger('dashboard init failed', errorMsg);
    } finally {
      this.loadingService.hide();
    }
  }
}
