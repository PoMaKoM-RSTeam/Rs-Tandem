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
  {
    path: 'reverse-code-review',
    loadComponent: () =>
      import('./pages/games/reverse-code-review/components/reverse-code-review/reverse-code-review').then(
        m => m.TndmReverseCode
      ),
    title: 'Reverse code review',
  },
];
