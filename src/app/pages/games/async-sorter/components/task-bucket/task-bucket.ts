import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'li[tndm-task-bucket]',
  templateUrl: './task-bucket.html',
  styleUrl: './task-bucket.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmTaskBucket {
  readonly heading = input.required();
}
