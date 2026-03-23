import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { Message, ROLES } from '../../shared/types';
import { SYSTEM_INSTRUCTION } from '../../shared/prompts';

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

  readonly allMessages = signal<Message[]>([{ role: ROLES.system, content: SYSTEM_INSTRUCTION }]);

  updateChatHistory({ role, content }: Message): void {
    const newMessage = { role, content };
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
}
