import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AUTH_ROUTES, TndmAuthService } from '@auth';
import { TndmButton } from '../../ui/tndm-button/tndm-button';
import { TndmNavigation } from '../tndm-navigation/tndm-navigation';
import { TndmTitleStrategy } from '../../../core/title-strategy/tndm-title-strategy';
import { APP_ROUTES } from '../../constants/app-routes';

@Component({
  selector: 'tndm-main-layout',
  templateUrl: './tndm-main-layout.html',
  styleUrl: './tndm-main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, TndmButton, TndmNavigation],
})
export class TndmMainLayout {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  readonly authService: TndmAuthService = inject(TndmAuthService);
  private titleStrategy = inject(TndmTitleStrategy);

  readonly pageTitle = this.titleStrategy.pageTitle;

  readonly config = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) {
          route = route.firstChild;
        }

        return {
          showLines: route.data['showLines'] ?? false,
          headerType: route.data['headerType'] ?? 'home',
        };
      })
    ),
    { initialValue: { showLines: false, headerType: 'home' } }
  );

  readonly signInBtnConfig = { label: 'sign in' } as const;
  readonly signUpBtnConfig = {
    label: 'sign up',
    variant: 'secondary',
  } as const;
  readonly logoutBtnConfig = {
    label: 'logout',
    variant: 'secondary',
  } as const;

  onSignInClick(): void {
    this.router.navigate([AUTH_ROUTES.LOGIN]);
  }

  onSignUpClick(): void {
    this.router.navigate([AUTH_ROUTES.REGISTER]);
  }

  onLogoutClick(): void {
    this.authService.logout();
    this.router.navigate([APP_ROUTES.home]);
  }
}
