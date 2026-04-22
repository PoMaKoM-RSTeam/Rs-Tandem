import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { UserActivityHub } from '../../../../core/services/user-service/user-api-service.types';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'tndm-streak-calendar',
  imports: [TranslocoPipe],
  templateUrl: './tndm-streak-calendar.html',
  styleUrl: './tndm-streak-calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmStreakCalendar {
  private readonly CALENDAR_COLS = 15;
  private readonly CALENDAR_ROWS = 7;
  private readonly totalCells = this.CALENDAR_COLS * this.CALENDAR_ROWS;
  private readonly transloco = inject(TranslocoService);
  private readonly tStreak = toSignal(this.transloco.selectTranslateObject<Record<string, string>>('dashboard.streak'));
  private readonly tDays = toSignal(this.transloco.selectTranslateObject<Record<string, string>>('days'));

  readonly streakData = input<UserActivityHub | null>();
  readonly daysOfWeek = computed(() => {
    const labels = this.tDays();
    if (!labels) return [];

    return [labels['mo'], labels['tu'], labels['we'], labels['th'], labels['fr'], labels['sa'], labels['su']];
  });

  readonly calendarDays = computed(() => {
    const days = [];
    const now = new Date();

    const currentDayIdx = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const daysUntilEndOfWeek = 6 - currentDayIdx;

    const startDate = new Date(now);
    startDate.setDate(now.getDate() + daysUntilEndOfWeek);

    for (let i = this.totalCells - 1; i >= 0; i--) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() - i);

      const dateString = date.toISOString().split('T')[0];

      days.push({
        date: dateString,
        isToday: dateString === now.toISOString().split('T')[0],
        isActive: this.streakData()?.activity_dates.includes(dateString),
      });
    }
    return days;
  });
}
