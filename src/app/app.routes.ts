import { Routes } from '@angular/router';
import { AUTH_ROUTES_SEGMENTS, authRoutes, tndmAuthGuard } from '@auth';
import { TndmAuthPage } from './pages/tndm-auth-page/tndm-auth-page';
import { TndmMainLayout } from './shared/components/tndm-main-layout/tndm-main-layout';
import { APP_ROUTES } from './shared/constants/app-routes';

export const routes: Routes = [
  {
    path: AUTH_ROUTES_SEGMENTS.AUTH,
    component: TndmAuthPage,
    children: authRoutes,
  },
  {
    path: '',
    component: TndmMainLayout,
    children: [
      { path: '', redirectTo: APP_ROUTES.home, pathMatch: 'full' },
      {
        path: APP_ROUTES.home,
        loadComponent: () => import('./pages/tndm-home-page/tndm-home-page').then(m => m.TndmHomePage),
        title: 'code_forge',
        data: {
          showLines: true,
          headerType: 'home',
        },
      },
      {
        path: APP_ROUTES.asyncSorter,
        loadComponent: () => import('./pages/games/async-sorter/async-sorter').then(m => m.TndmAsyncSorter),
        title: 'async-sorter',
        canActivate: [tndmAuthGuard],
      },
      {
        path: APP_ROUTES.aiExam,
        loadComponent: () => import('./pages/games/ai-exam/ai-exam').then(m => m.TndmAiExam),
        title: 'ai-exam',
        canActivate: [tndmAuthGuard],
      },
      {
        path: APP_ROUTES.codeGolf,
        loadComponent: () => import('./pages/games/code-golf/components/code-golf/code-golf').then(m => m.TndmCodeGolf),
        title: 'Code Golf',
        data: {
          showLines: true,
        },
        canActivate: [tndmAuthGuard],
      },
      {
        path: APP_ROUTES.sandbox,
        loadComponent: () => import('./pages/code-sandbox/sandbox').then(m => m.TndmSandbox),
        title: 'Sandbox',
        canActivate: [tndmAuthGuard],
      },
    ],
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
    path: '**',
    loadComponent: () => import('./pages/tndm-not-found-page/tndm-not-found-page').then(m => m.TndmNotFoundPage),
    title: 'Not Found',
  },
];
