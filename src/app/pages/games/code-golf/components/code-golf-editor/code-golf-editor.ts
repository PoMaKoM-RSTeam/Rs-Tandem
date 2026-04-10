import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'tndm-code-golf-editor',
  standalone: true,
  imports: [FormsModule, TranslocoPipe],
  templateUrl: 'code-golf-editor.html',
  styleUrl: './code-golf-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeGolfEditor {
  readonly value = model<string>('');
}
