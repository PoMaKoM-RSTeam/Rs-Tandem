import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TndmButton } from '../../shared/ui/tndm-button/tndm-button';
import { Router } from '@angular/router';
import { NavigationService } from '../../core/services/navigation/navigation.service';

@Component({
  selector: 'tndm-home-page',
  imports: [TndmButton],
  templateUrl: './tndm-home-page.html',
  styleUrl: './tndm-home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmHomePage {
  private router = inject(Router);
  private readonly navService: NavigationService = inject(NavigationService);

  readonly joinBtnConfig = { label: 'create an account' } as const;

  onSignUpClick(): void {
    this.navService.goToRegister();
  }
}
