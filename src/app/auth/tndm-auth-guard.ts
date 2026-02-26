import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AUTH_ROUTES } from './constants/router';
import { TndmAuthService } from './tndm-auth-service';

export const tndmAuthGuard: CanActivateFn = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Promise<boolean> => {
  const authService: TndmAuthService = inject(TndmAuthService);
  const router: Router = inject(Router);

  await authService.initSession();

  const isAuth: boolean = authService.isAuthenticated;

  const url: string = state.url;
  const isAuthRoute: boolean = url.startsWith(AUTH_ROUTES.AUTH);

  if (!isAuth && !isAuthRoute) {
    router.navigateByUrl(AUTH_ROUTES.LOGIN).then();

    return false;
  }

  return !(isAuth && isAuthRoute);
};
