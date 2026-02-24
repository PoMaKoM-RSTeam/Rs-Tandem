import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'li[tndm-code-block]',
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeBlock {}
