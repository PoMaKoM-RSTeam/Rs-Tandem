import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { TndmCodeBlocksList } from './components/code-blocks-list/code-blocks-list';
import { TndmTaskBucketsList } from './components/task-buckets-list/task-buckets-list';
import { TndmFinalCallStack } from './components/final-call-stack/final-call-stack';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';

@Component({
  selector: 'tndm-async-sorter',
  templateUrl: 'async-sorter.html',
  styleUrl: 'async-sorter.scss',
  imports: [TndmButton, TndmCodeBlocksList, TndmTaskBucketsList, TndmFinalCallStack, CdkDropListGroup],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmAsyncSorter {}
