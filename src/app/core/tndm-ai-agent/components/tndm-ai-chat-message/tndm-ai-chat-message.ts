import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChatMessage } from '../../types/chat';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-ai-chat-message',
  templateUrl: './tndm-ai-chat-message.html',
  styleUrl: './tndm-ai-chat-message.scss',
  standalone: true,
})
export class TndmAiChatMessage {
  readonly message = input.required<ChatMessage>();
  readonly assistantTyping = input<boolean>(false);
  readonly currentAssistantId = input<string | null>(null);

  protected readonly isCurrentAssistant = computed(() => this.currentAssistantId() === this.message().id);

  protected readonly isAssistant = computed(() => this.message().role === 'assistant');

  protected readonly isUser = computed(() => this.message().role === 'user');

  protected readonly showCursor = computed(
    () => this.isAssistant() && this.assistantTyping() && this.isCurrentAssistant()
  );
}
