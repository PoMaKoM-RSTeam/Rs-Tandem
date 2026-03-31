import { Component, input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { TndmCodeBlock } from '../code-block/code-block';
import { CodeBlockData } from '../../shared/types';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'ul[tndm-final-call-stack]',
  templateUrl: './final-call-stack.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './final-call-stack.scss',
  imports: [TndmCodeBlock, TranslocoPipe],
})
export class TndmFinalCallStack {
  readonly codeBlocks = input.required<CodeBlockData[]>();
  readonly invisibleCodeBlocks = input.required<CodeBlockData[]>();
}
