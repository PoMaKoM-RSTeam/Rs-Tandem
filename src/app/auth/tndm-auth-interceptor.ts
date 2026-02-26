import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { inject } from '@angular/core';
import { TndmAuthService } from '@auth';

export const tndmAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService: TndmAuthService = inject(TndmAuthService);

  if (!req.url.includes(environment.supabaseUrl)) {
    return next(req);
  }

  const jwt: string | null = authService.jwt();

  if (!jwt) {
    return next(req);
  }

  const authReq: HttpRequest<unknown> = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${jwt}`),
  });

  return next(authReq);
};
