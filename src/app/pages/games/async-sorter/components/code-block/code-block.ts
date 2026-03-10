import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'li[tndm-code-block]',
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
  hostDirectives: [
    {
      directive: CdkDrag,
      inputs: ['cdkDragData'],
    },
  ],
  host: {
    '[attr.data-execution-order]': 'executionOrder()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeBlock {
  readonly executionOrder = input.required<number>();
}
