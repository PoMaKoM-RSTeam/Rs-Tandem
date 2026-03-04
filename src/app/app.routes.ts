import { Routes } from '@angular/router';
import { TndmAsyncSorter } from './pages/games/async-sorter/async-sorter';

export const routes: Routes = [
  {
    path: 'async-sorter',
    component: TndmAsyncSorter,
  },
  {
    path: 'code-golf',
    loadComponent: () => import('./pages/games/code-golf/components/code-golf/code-golf').then(m => m.TndmCodeGolf),
    title: 'Code Golf',
  },
];
