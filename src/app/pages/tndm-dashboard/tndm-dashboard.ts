import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { TndmDashboardWidget } from './components/tndm-dashboard-widget/tndm-dashboard-widget';
import { TndmStreakCalendar } from './components/tndm-streak-calendar/tndm-streak-calendar';
import { DashboardService } from './tndm-dashboard.service';
import { TndmLeaderboardWidget } from './components/tndm-leaderboard-widget/tndm-leaderboard-widget';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'tndm-dashboard',
  imports: [TndmDashboardWidget, TndmStreakCalendar, TndmLeaderboardWidget, NgOptimizedImage],
  templateUrl: './tndm-dashboard.html',
  styleUrl: './tndm-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly userProgress = this.dashboardService.userProgress;
  readonly playerStats = this.dashboardService.playerStats;
  readonly streakData = this.dashboardService.streakData;
  readonly gamesProgress = this.dashboardService.gamesProgresses;
  readonly user = this.dashboardService.userProfile;
  readonly leaderboard = this.dashboardService.leaderboard;

  readonly userName = computed(() => this.dashboardService.userProfile()?.displayName ?? 'Player');

  ngOnInit(): void {
    this.dashboardService.initDashboard();
  }

  readonly expandedGame = signal<string | null>(null);

  toggleGame(title: string): void {
    this.expandedGame.update(curr => (curr === title ? null : title));
  }
}
