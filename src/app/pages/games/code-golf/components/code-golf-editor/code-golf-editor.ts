import { ChangeDetectionStrategy, Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'tndm-code-golf-editor',
  standalone: true,
  imports: [FormsModule],
  template: `
    <textarea class="code-editor" placeholder="// Write your code here..." spellcheck="false" [(ngModel)]="value">
    </textarea>
  `,
  styleUrl: './code-golf-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeGolfEditor {
  readonly value = model<string>('');
}
