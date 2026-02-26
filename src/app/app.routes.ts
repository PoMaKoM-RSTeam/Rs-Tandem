import { Routes } from '@angular/router';
import { TndmAsyncSorter } from './pages/games/async-sorter/async-sorter';
import { TndmCodeGolf } from './pages/games/code-golf/components/code-golf/code-golf';
import { AUTH_ROUTES_SEGMENTS, authRoutes, tndmAuthGuard } from '@auth';
import { TndmAuthPage } from './pages/tndm-auth-page/tndm-auth-page';

export const routes: Routes = [
  { path: '', redirectTo: 'code-golf', pathMatch: 'full' },
  {
    path: AUTH_ROUTES_SEGMENTS.AUTH,
    component: TndmAuthPage,
    children: authRoutes,
    canActivate: [tndmAuthGuard],
  },
  {
    path: 'async-sorter',
    component: TndmAsyncSorter,
    canActivate: [tndmAuthGuard],
  },
  {
    path: 'code-golf',
    component: TndmCodeGolf,
    title: 'Code Golf',
    canActivate: [tndmAuthGuard],
  },
  { path: '**', redirectTo: 'code-golf' },
];
