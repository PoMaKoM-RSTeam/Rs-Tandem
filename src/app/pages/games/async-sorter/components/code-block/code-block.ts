import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'li[tndm-code-block]',
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
  hostDirectives: [
    {
      directive: CdkDrag,
      inputs: ['cdkDragData', 'cdkDragDisabled'],
    },
  ],
  host: {
    '[attr.data-execution-order]': 'executionOrder()',
    '[class.in-final-stack]': 'inFinalStack()',
    '[class.in-wrong-bucket]': 'inWrongBucket()',
    '[class.is-placed-correctly]': 'isPlacedCorrectly()',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeBlock {
  readonly executionOrder = input.required<number>();

  readonly inFinalStack = input<boolean>(false);

  readonly inWrongBucket = input<boolean>(false);
  readonly isPlacedCorrectly = input<boolean>(false);
}
