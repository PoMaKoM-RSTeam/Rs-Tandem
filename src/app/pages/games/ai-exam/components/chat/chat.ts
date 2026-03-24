import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { Message, Role, ROLES } from '../../shared/types';

type UpdataChatHistoryParams = {
  role: Role;
  content: string;
};

@Component({
  selector: 'tndm-chat',
  templateUrl: './chat.html',
  imports: [MarkdownComponent],
  styleUrl: './chat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmChat {
  readonly chatContainer = viewChild<ElementRef<HTMLDivElement>>('chatContainer');
  readonly isLoading = input.required<boolean>();
  readonly ROLES = ROLES;

  readonly allMessages = signal<Message[]>([]);

  updateChatHistory({ role, content }: UpdataChatHistoryParams): void {
    const newMessage: Message = {
      role,
      parts: [
        {
          text: content,
        },
      ],
    };
    this.allMessages.update(messages => [...messages, newMessage]);
    this.scrollChatToBottom();
  }

  private scrollChatToBottom(): void {
    requestAnimationFrame(() => {
      const container = this.chatContainer()?.nativeElement;
      if (!container) return;

      container.scrollTop = container.scrollHeight;
    });
  }

  getMessageText(message: Message): string {
    const { parts } = message;
    const textPart = parts.find(part => 'text' in part);
    if (!textPart) throw new Error('Text part not found');

    return textPart.text;
  }
}
