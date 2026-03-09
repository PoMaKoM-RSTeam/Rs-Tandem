import { ChangeDetectionStrategy, Component } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeBlock {}
