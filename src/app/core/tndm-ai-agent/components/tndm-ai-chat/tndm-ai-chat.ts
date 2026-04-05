import { ChangeDetectionStrategy, Component, effect, ElementRef, inject, viewChild } from '@angular/core';
import { TndmAiChatService } from '../../services/tndm-ai-chat-service';
import { TndmAiChatMessage } from '../tndm-ai-chat-message/tndm-ai-chat-message';

@Component({
  selector: 'tndm-ai-chat',
  standalone: true,
  templateUrl: './tndm-ai-chat.html',
  styleUrl: './tndm-ai-chat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TndmAiChatMessage],
})
export class TndmAiChat {
  private readonly chatService = inject(TndmAiChatService);

  protected readonly messages = this.chatService.messages;
  protected readonly assistantTyping = this.chatService.assistantTyping;
  protected readonly currentAssistantId = this.chatService.currentAssistantId;

  private readonly scrollContainer = viewChild.required<ElementRef<HTMLDivElement>>('scrollContainer');

  constructor() {
    effect(() => {
      this.messages();

      queueMicrotask(() => {
        const el = this.scrollContainer().nativeElement;
        el.scrollTop = el.scrollHeight;
      });
    });
  }
}
