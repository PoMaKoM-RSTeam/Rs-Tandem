import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'li[tndm-code-block]',
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
  hostDirectives: [CdkDrag],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeBlock {}
