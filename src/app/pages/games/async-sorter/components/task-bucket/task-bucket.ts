import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TndmCodeBlock } from '../code-block/code-block';

@Component({
  selector: 'li[tndm-task-bucket]',
  templateUrl: './task-bucket.html',
  styleUrl: './task-bucket.scss',
  imports: [CdkDropList, TndmCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmTaskBucket {
  readonly heading = input.required<string>();

  bucketItems: string[] = [];

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }
}
