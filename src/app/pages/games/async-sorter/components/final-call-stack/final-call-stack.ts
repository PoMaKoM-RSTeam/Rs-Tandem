import { Component, input } from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import { CodeBlockData } from '../code-blocks-list/code-blocks-data';

@Component({
  selector: 'ul[tndm-final-call-stack]',
  templateUrl: './final-call-stack.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './final-call-stack.scss',
})
export class TndmFinalCallStack {
  readonly codeBlocks = input.required<CodeBlockData[]>();
}
