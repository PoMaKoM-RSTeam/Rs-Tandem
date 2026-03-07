import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'li[tndm-task-bucket]',
  templateUrl: './task-bucket.html',
  styleUrl: './task-bucket.scss',
  imports: [CdkDropList],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmTaskBucket {
  readonly heading = input.required<string>();

  bucketItems: string[] = [];

  drop(event: CdkDragDrop<string[]>): void {
    if (event.previousContainer === event.container) {
      // 1. The user dropped it in the same list they dragged it from (Reordering)
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // 2. The user dropped it into a different list (Transferring)
      transferArrayItem(
        event.previousContainer.data, // The array the item came from
        event.container.data, // The array the item is going to
        event.previousIndex, // The index it was at
        event.currentIndex // The index it was dropped at
      );
    }
  }
}
