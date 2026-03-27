import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TndmAuthService } from '@auth';
import { TndmButton } from '../../ui/tndm-button/tndm-button';
import { TndmNavigation } from '../tndm-navigation/tndm-navigation';
import { TndmTitleStrategy } from '../../../core/title-strategy/tndm-title-strategy';
import { NavigationService } from '../../../core/services/navigation/navigation.service';

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
  private titleStrategy = inject(TndmTitleStrategy);
  readonly authService: TndmAuthService = inject(TndmAuthService);

  readonly navService: NavigationService = inject(NavigationService);

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
    this.navService.goToLogin();
  }

  onSignUpClick(): void {
    this.navService.goToRegister();
  }

  onLogoutClick(): void {
    this.navService.logout();
  }
}
