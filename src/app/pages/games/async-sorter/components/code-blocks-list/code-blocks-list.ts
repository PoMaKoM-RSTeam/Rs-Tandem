import { Component } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TndmCodeBlock } from '../code-block/code-block';
import codeBlocksJson from './code-blocks.json';

@Component({
  selector: 'ul[tndm-code-blocks-list]',
  imports: [TndmCodeBlock],
  templateUrl: './code-blocks-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './code-blocks-list.scss',
})
export class TndmCodeBlocksList {
  readonly codeBlocks = codeBlocksJson;

  isChain(item: unknown): item is string[] {
    return Array.isArray(item);
  }
}
