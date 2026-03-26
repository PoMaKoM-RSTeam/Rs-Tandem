import { Component, input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TndmCodeBlock } from '../code-block/code-block';
import { CodeBlockData } from '../../shared/types';

@Component({
  selector: 'ul[tndm-final-call-stack]',
  templateUrl: './final-call-stack.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './final-call-stack.scss',
  imports: [TndmCodeBlock],
})
export class TndmFinalCallStack {
  readonly codeBlocks = input.required<CodeBlockData[]>();
  readonly invisibleCodeBlocks = input.required<CodeBlockData[]>();
}
