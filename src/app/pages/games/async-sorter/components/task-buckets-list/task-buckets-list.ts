import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TndmTaskBucket } from '../task-bucket/task-bucket';

@Component({
  selector: 'ul[tndm-task-bucket-list]',
  imports: [TndmTaskBucket],
  templateUrl: './task-buckets-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './task-buckets-list.scss',
})
export class TndmTaskBucketsList {
  readonly buckets = [
    { id: 'sync', heading: 'Synchronous (Call Stack)' },
    { id: 'micro', heading: 'Micro Tasks' },
    { id: 'macro', heading: 'Macro Tasks' },
  ];
}
