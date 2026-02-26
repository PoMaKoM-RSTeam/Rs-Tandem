import { Routes } from '@angular/router';
import { AUTH_ROUTES_SEGMENTS, tndmAuthGuard } from '@auth';

export const authRoutes: Routes = [
  { path: '', redirectTo: AUTH_ROUTES_SEGMENTS.LOGIN, pathMatch: 'full' },
  {
    path: AUTH_ROUTES_SEGMENTS.LOGIN,
    loadComponent: () => import('./forms/tndm-login-form/tndm-login-form').then(m => m.TndmLoginForm),
    canActivate: [tndmAuthGuard],
  },
  {
    path: AUTH_ROUTES_SEGMENTS.REGISTER,
    loadComponent: () => import('./forms/tndm-register-form/tndm-register-form').then(m => m.TndmRegisterForm),
    canActivate: [tndmAuthGuard],
  },
  {
    path: AUTH_ROUTES_SEGMENTS.FORGOT_PASSWORD,
    loadComponent: () =>
      import('./forms/tndm-forgot-password-form/tndm-forgot-password-form').then(m => m.TndmForgotPasswordForm),
    canActivate: [tndmAuthGuard],
  },
  {
    path: AUTH_ROUTES_SEGMENTS.UPDATE_PASSWORD,
    loadComponent: () => import('./forms/tndm-update-password/tndm-update-password').then(m => m.TndmUpdatePassword),
    canActivate: [tndmAuthGuard],
  },
];
