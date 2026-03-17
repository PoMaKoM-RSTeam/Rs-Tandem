import { Component, effect, output, signal } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TndmCodeBlock } from '../code-block/code-block';
import { CodeBlockData, codeBlocks } from './code-blocks-data';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';

@Component({
  selector: 'tndm-code-blocks-list',
  templateUrl: './code-blocks-list.html',
  styleUrl: './code-blocks-list.scss',
  imports: [CdkDropList, TndmCodeBlock, CdkDrag],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeBlocksList {
  readonly codeBlocks = signal<CodeBlockData[]>([...codeBlocks]);
  readonly isEmpty = output<void>();

  constructor() {
    effect(() => {
      if (this.codeBlocks().length === 0) {
        this.isEmpty.emit();
      }
    });
  }

  noReturnPredicate(): false {
    return false;
  }

  removeCodeBlock(executionOrder: number): void {
    this.codeBlocks.update(array => array.filter(block => block.executionOrder !== executionOrder));
  }
}
