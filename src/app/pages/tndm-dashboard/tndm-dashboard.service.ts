import { computed, inject, Injectable, signal } from '@angular/core';
import { UserService } from '../../core/services/user-service/user-api.service';
import { GameApiService } from '../../core/services/game-service/game-api.service';
import { LoadingOverlayService } from '../../core/loading-overlay/loading-overlay-service';
import { GamesProgressData } from '../../core/services/game-service/game-service.types';
import { UserActivityHub } from '../../core/services/user-service/user-api-service.types';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly userService = inject(UserService);
  private readonly gameService = inject(GameApiService);
  private readonly loadingService = inject(LoadingOverlayService);

  private readonly _gamesProgress = signal<GamesProgressData[] | null>(null);
  private readonly _streakData = signal<UserActivityHub | null>(null);

  readonly streakData = this._streakData.asReadonly();
  readonly userProfile = this.userService.profile;

  readonly userProgress = computed(() => {
    const profile = this.userProfile();
    if (!profile?.rank) return { current: 0, max: 100, rankName: 'Junior' };

    const { rank, totalXp } = profile;
    return {
      current: Math.max(0, (totalXp ?? 0) - (rank.minXp ?? 0)),
      max: (rank.maxXp ?? 0) - (rank.minXp ?? 0) || 100,
      rankName: rank.name || 'No Rank',
    };
  });

  readonly playerStats = computed(() => {
    const profile = this.userProfile();
    if (!profile) return [];
    return [
      { label: 'rank:', value: profile.rank?.name ?? 'No Rank' },
      { label: 'total completed lvl:', value: String(profile.totalCompletedLevels) },
      { label: 'position:', value: `#${profile.globalRankPosition}` },
      { label: 'total xp:', value: String(profile.totalXp) },
    ];
  });

  readonly gamesProgresses = computed(() => {
    const games = this._gamesProgress();
    if (!games) return [];

    return games.map(game => ({
      title: game.title,
      current: game.completed_levels_count,
      max: game.total_levels,
      stats: [
        {
          label: 'lvl:',
          value: `${game.completed_levels_count}/${game.total_levels}`,
        },
        {
          label: 'total score:',
          value: String(game.total_game_xp),
        },
        {
          label: 'position:',
          value: `#${game.game_rank_position}`,
        },
      ],
    }));
  });

  async initDashboard(): Promise<void> {
    this.loadingService.show();
    try {
      await this.userService.loadUserSession();

      const [activity, games] = await Promise.all([
        this.userService.getActivityHub(),
        this.gameService.getGamesProgress(),
      ]);

      this._streakData.set(activity);
      this._gamesProgress.set(games);
    } finally {
      this.loadingService.hide();
    }
  }
}
