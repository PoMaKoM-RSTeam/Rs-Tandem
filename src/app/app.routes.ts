import { Routes } from '@angular/router';
import { TndmAsyncSorter } from './pages/games/async-sorter/async-sorter';
import { TndmCodeGolf } from './pages/games/code-golf/components/code-golf/code-golf';
import { TndmTypeInvestigator } from './pages/games/type-investigator/components/type-investigator/type-investigator';

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
  {
    path: 'type-investigator',
    component: TndmTypeInvestigator,
    title: 'Type Investigator',
  },
];
