import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TndmButton } from '../../shared/ui/tndm-button/tndm-button';
import { AUTH_ROUTES } from '@auth';
import { Router } from '@angular/router';

@Component({
  selector: 'tndm-home-page',
  imports: [TndmButton],
  templateUrl: './tndm-home-page.html',
  styleUrl: './tndm-home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmHomePage {
  private router = inject(Router);

  readonly joinBtnConfig = { label: 'create an account' } as const;

  onSignUpClick(): void {
    this.router.navigate([AUTH_ROUTES.REGISTER]);
  }
}
