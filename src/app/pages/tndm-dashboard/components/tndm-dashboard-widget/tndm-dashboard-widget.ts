import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TndmCircleProgress } from '../tndm-circle-progress/tndm-circle-progress';
import { CommonModule } from '@angular/common';

export type DashboardStatItem = {
  label: string;
  value: string | number;
  trend?: 'up' | 'down';
  color?: string;
};

@Component({
  selector: 'tndm-dashboard-widget',
  imports: [TndmCircleProgress, CommonModule],
  templateUrl: './tndm-dashboard-widget.html',
  styleUrl: './tndm-dashboard-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmDashboardWidget {
  readonly title = input<string | null>(null);
  readonly size = input<string | null>('s');
  readonly stats = input<DashboardStatItem[]>([]);
  readonly max = input(100);
  readonly current = input(0);
  readonly label = input<string | number | null>(null);
}
