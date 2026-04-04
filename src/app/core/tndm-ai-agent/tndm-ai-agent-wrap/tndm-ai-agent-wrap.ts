import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TndmAvatar } from '../../../pages/tndm-ai-agent/components/tndm-ai-avatar/tndm-avatar.component';
import { TndmAiChat } from '../../../pages/tndm-ai-agent/components/tndm-ai-chat/tndm-ai-chat';
import { TndmAiInput } from '../../../pages/tndm-ai-agent/components/tndm-ai-input/tndm-ai-input.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-ai-agent-wrap',
  imports: [TndmAiChat, TndmAiInput, TndmAvatar],
  templateUrl: './tndm-ai-agent-wrap.html',
  styleUrl: './tndm-ai-agent-wrap.scss',
  standalone: true,
})
export class TndmAiAgentWrap {
  readonly isOpen = input<boolean>(false);
}
