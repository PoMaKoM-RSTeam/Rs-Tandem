import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TndmCodeBlock } from '../code-block/code-block';
import { CodeBlockData } from '../code-blocks-list/code-blocks-data';
import { TaskType } from '../../shared/types';

@Component({
  selector: 'li[tndm-task-bucket]',
  templateUrl: './task-bucket.html',
  styleUrl: './task-bucket.scss',
  imports: [CdkDropList, TndmCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmTaskBucket {
  readonly heading = input.required<string>();
  readonly taskType = input.required<TaskType>();
  readonly codeBlocks = input.required<CodeBlockData[]>();
  readonly isDraggingDisabled = input.required<boolean>();
  readonly isButtonPressed = input.required<boolean>();

  readonly bucketContentUpdated = output<CodeBlockData[]>();
  readonly codeBlockDropped = output<CodeBlockData>();

  drop(event: CdkDragDrop<CodeBlockData[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }

    this.bucketContentUpdated.emit([...event.container.data]);
    this.codeBlockDropped.emit(event.item.data);
  }
}
