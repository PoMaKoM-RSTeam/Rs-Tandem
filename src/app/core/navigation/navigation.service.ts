import { AUTH_ROUTES, TndmAuthService } from '@auth';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { APP_ROUTES } from '../../shared/constants/app-routes';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  readonly route = inject(Router);
  readonly authService = inject(TndmAuthService);

  goToLogin(): void {
    this.route.navigate([AUTH_ROUTES.LOGIN]);
  }

  goToRegister(): void {
    this.route.navigate([AUTH_ROUTES.REGISTER]);
  }

  logout(): void {
    this.authService.logout();
    this.route.navigate([APP_ROUTES.home]);
  }
}
