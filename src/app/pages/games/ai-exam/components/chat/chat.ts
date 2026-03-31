import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { ExamLanguage, Message, ROLES } from '../../shared/types';

type UpdateChatHistoryParams =
  | {
      role: typeof ROLES.model;
      content: string;
    }
  | {
      role: typeof ROLES.user;
      content: string;
      examLanguage: ExamLanguage;
      remainingAttempts: number;
      isQuestionGeneration: boolean;
      selectedTopics?: string;
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

  updateChatHistory(params: UpdateChatHistoryParams): void {
    const parts = [{ text: params.content }];

    if (params.role === ROLES.user) {
      const langNote =
        params.examLanguage === 'english'
          ? `[System note: Exam language is English. Write your ENTIRE reply in English ` +
            '(question, feedback, headings, and the JSON "message" string). ' +
            'Ignore user typos in other languages; keep English for the exam.]'
          : '[System note: Exam language is Russian. Write your ENTIRE reply in Russian ' +
            '(question, feedback, headings, and the JSON "message" string). ' +
            'Ignore user typos in other languages; keep Russian for the exam.]';
      parts.push({ text: langNote });
      parts.push({ text: `[System note: Remaining attempts: ${params.remainingAttempts}]` });

      if (params.isQuestionGeneration) {
        parts.push({
          text: `[System note: You MUST ask a question specifically related
          to one of these topics: ${params.selectedTopics}.]`,
        });
      }
    }

    const newMessage: Message = {
      role: params.role,
      parts,
    };

    this.allMessages.update(messages => [...messages, newMessage]);
    this.scrollChatToBottom();
  }

  resetChatHistory(): void {
    this.allMessages.set([]);
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
