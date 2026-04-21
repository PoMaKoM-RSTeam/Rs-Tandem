import { UserService } from './core/services/user-service/user-api.service';
import { TndmUserProfile } from './pages/tndm-user-profile/tndm-user-profile';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TndmToaster } from './shared/ui/tndm-toaster/tndm-toaster';
import { TndmLoadingOverlay } from './shared/ui/tndm-loading-overlay/tndm-loading-overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TndmToaster, TndmLoadingOverlay, TndmUserProfile],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly userService: UserService = inject(UserService);
  protected readonly title = signal('my-temp-app');

  async ngOnInit(): Promise<void> {
    await this.userService.loadUserSession();
  }
}
