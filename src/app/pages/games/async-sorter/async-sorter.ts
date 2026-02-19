import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'tndm-async-sorter',
  templateUrl: 'async-sorter.html',
  styleUrl: 'async-sorter.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmAsyncSorter {}
