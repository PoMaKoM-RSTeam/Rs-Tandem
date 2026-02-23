import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TndmButtonComponent } from '../../../shared/ui/tndm-button-component/tndm-button-component';
import { TndmCodeBlocksList } from './components/code-blocks-list/code-blocks-list';
import { TndmTaskBucketsList } from './components/task-buckets-list/task-buckets-list';
import { TndmFinalCallStack } from './components/final-call-stack/final-call-stack';

@Component({
  selector: 'tndm-async-sorter',
  templateUrl: 'async-sorter.html',
  styleUrl: 'async-sorter.scss',
  imports: [TndmButtonComponent, TndmCodeBlocksList, TndmTaskBucketsList, TndmFinalCallStack],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmAsyncSorter {}
