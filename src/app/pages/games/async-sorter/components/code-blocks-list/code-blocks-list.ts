import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TndmCodeBlock } from '../code-block/code-block';
import codeBlocksJson from './code-blocks.json';
import { CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'tndm-code-blocks-list',
  templateUrl: './code-blocks-list.html',
  styleUrl: './code-blocks-list.scss',
  imports: [CdkDropList, TndmCodeBlock],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeBlocksList {
  readonly codeBlocks = codeBlocksJson;

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.codeBlocks, event.previousIndex, event.currentIndex);
  }
}
