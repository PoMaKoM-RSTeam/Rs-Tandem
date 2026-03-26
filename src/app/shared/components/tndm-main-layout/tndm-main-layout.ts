import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AUTH_ROUTES, TndmAuthService } from '@auth';
import { TndmButton } from '../../ui/tndm-button/tndm-button';
import { TndmNavigation } from '../tndm-navigation/tndm-navigation';

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

  readonly config = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let route = this.route;
        while (route.firstChild) {
          route = route.firstChild;
        }
        const snapshot = route.snapshot;
        const title = snapshot?.title ?? 'CODE_FORGE';

        return {
          title: this.formatTitle(title) ?? 'code_forge',
          showLines: snapshot?.data?.['showLines'] ?? false,
          headerType: snapshot?.data?.['headerType'] ?? 'home',
        };
      })
    ),
    {
      initialValue: {
        title: 'code_forge',
        showLines: false,
        headerType: 'home',
      },
    }
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
    this.router.navigate(['/home']);
  }

  private formatTitle(title: string): string {
    return title.toLowerCase().replace(/[\s-]+/g, '_');
  }
}
