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
  selector: 'tndm-main-block',
  imports: [TndmCircleProgress, CommonModule],
  templateUrl: './tndm-main-block.html',
  styleUrl: './tndm-main-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmMainBlock {
  readonly title = input<string | null>(null);
  readonly size = input<string | null>('s');
  readonly stats = input<DashboardStatItem[]>([]);
  readonly max = input(100);
  readonly current = input(0);
  readonly label = input<string | number | null>(null);
}
