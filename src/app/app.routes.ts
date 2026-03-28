import { Routes } from '@angular/router';
import { TndmAsyncSorter } from './pages/games/async-sorter/async-sorter';
import { AUTH_ROUTES_SEGMENTS, authRoutes, tndmAuthGuard } from '@auth';
import { TndmAuthPage } from './pages/tndm-auth-page/tndm-auth-page';

export const routes: Routes = [
  { path: '', redirectTo: 'code-golf', pathMatch: 'full' },
  {
    path: AUTH_ROUTES_SEGMENTS.AUTH,
    component: TndmAuthPage,
    children: authRoutes,
  },
  {
    path: 'async-sorter',
    component: TndmAsyncSorter,
    canActivate: [tndmAuthGuard],
  },
  {
    path: 'code-golf',
    loadComponent: () => import('./pages/games/code-golf/components/code-golf/code-golf').then(m => m.TndmCodeGolf),
    title: 'Code Golf',
    canActivate: [tndmAuthGuard],
  },
  {
    path: 'sandbox',
    loadComponent: () => import('./pages/code-sandbox/sandbox').then(m => m.TndmSandbox),
    title: 'Sandbox',
    canActivate: [tndmAuthGuard],
  },
  {
    path: 'type-investigator',
    title: 'Type Investigator',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/games/type-investigator/components/type-investigator/type-investigator').then(
            m => m.TndmTypeInvestigator
          ),
      },
      {
        path: ':puzzleId',
        loadComponent: () =>
          import('./pages/games/type-investigator/components/type-investigator/type-investigator').then(
            m => m.TndmTypeInvestigator
          ),
      },
    ],
    canActivate: [tndmAuthGuard],
  },
  {
    path: 'reverse-code-review',
    title: 'Reverse code review',
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/games/reverse-code-review/components/reverse-code-review/reverse-code-review').then(
            m => m.TndmReverseCode
          ),
      },
      {
        path: ':caseId',
        loadComponent: () =>
          import('./pages/games/reverse-code-review/components/reverse-code-review/reverse-code-review').then(
            m => m.TndmReverseCode
          ),
      },
    ],
    canActivate: [tndmAuthGuard],
  },
  {
    path: '**',
    loadComponent: () => import('./pages/tndm-not-found-page/tndm-not-found-page').then(m => m.TndmNotFoundPage),
    title: 'Not Found',
  },
];
