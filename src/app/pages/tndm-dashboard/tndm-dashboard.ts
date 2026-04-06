import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import { TndmDashboardWidget } from './components/tndm-dashboard-widget/tndm-dashboard-widget';
import { TndmStreakCalendar } from './components/tndm-streak-calendar/tndm-streak-calendar';
import { DashboardService } from './tndm-dashboard.service';

@Component({
  selector: 'tndm-dashboard',
  imports: [TndmDashboardWidget, TndmStreakCalendar],
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

  readonly userName = computed(() => this.dashboardService.userProfile()?.displayName ?? 'Player');

  ngOnInit(): void {
    this.dashboardService.initDashboard();
  }
}
