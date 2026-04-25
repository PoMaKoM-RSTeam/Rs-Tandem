import { ChangeDetectionStrategy, Component, effect, input, signal } from '@angular/core';
import { TndmAvatar } from '../tndm-ai-avatar/tndm-avatar.component';
import { TndmAiChat } from '../tndm-ai-chat/tndm-ai-chat';
import { TndmAiInput } from '../tndm-ai-input/tndm-ai-input.component';
import { DotGrid } from '../../../../shared/components/dot-grid/dot-grid';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-ai-agent-wrap',
  imports: [TndmAiChat, TndmAiInput, TndmAvatar, DotGrid],
  templateUrl: './tndm-ai-agent-wrap.html',
  styleUrl: './tndm-ai-agent-wrap.scss',
  standalone: true,
})
export class TndmAiAgentWrap {
  readonly isOpen = input<boolean>(false);
  protected readonly isIntroDone = signal(false);

  constructor() {
    effect(onCleanup => {
      if (!this.isOpen()) {
        this.isIntroDone.set(false);
        document.body.classList.remove('no-scroll');
        return;
      }

      this.isIntroDone.set(false);
      document.body.classList.add('no-scroll');

      const timeoutId = setTimeout((): void => {
        if (this.isOpen()) {
          this.isIntroDone.set(true);
        }
      }, 500);

      onCleanup((): void => {
        document.body.classList.remove('no-scroll');
        clearTimeout(timeoutId);
      });
    });
  }
}
