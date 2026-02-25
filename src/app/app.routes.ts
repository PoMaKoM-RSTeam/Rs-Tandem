import { Routes } from '@angular/router';
import { TndmAsyncSorter } from './pages/games/async-sorter/async-sorter';
import { TndmCodeGolf } from './pages/games/code-golf/components/code-golf/code-golf';

export const routes: Routes = [
  {
    path: 'async-sorter',
    component: TndmAsyncSorter,
  },
  {
    path: 'code-golf',
    component: TndmCodeGolf,
    title: 'Code Golf',
  },
];
