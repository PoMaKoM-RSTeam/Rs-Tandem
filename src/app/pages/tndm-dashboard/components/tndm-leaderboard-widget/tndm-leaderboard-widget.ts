import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LeaderboardEntry } from '../../../../core/services/game-service/game-service.types';
import { TndmAvatar } from '../../../../shared/components/avatar/tndm-avatar';

@Component({
  selector: 'tndm-leaderboard-widget',
  imports: [TndmAvatar],
  templateUrl: './tndm-leaderboard-widget.html',
  styleUrl: './tndm-leaderboard-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmLeaderboardWidget {
  readonly leaderboard = input<LeaderboardEntry[] | []>([]);
  readonly currentUserId = input<string | undefined>(undefined);
}
