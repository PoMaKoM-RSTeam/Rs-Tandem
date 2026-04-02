import { ChangeDetectionStrategy, Component, ElementRef, input, signal, viewChild } from '@angular/core';
import { MarkdownComponent } from 'ngx-markdown';
import { ExamLanguage, Message, ROLES } from '../../shared/types';

const LANGUAGE_MAP: Record<ExamLanguage, string> = {
  en: 'English',
  ru: 'Russian',
};

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

type TextParts = { text: string }[];

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
    const parts = this.buildUserMessageParts(params);

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

  private buildUserMessageParts(params: UpdateChatHistoryParams): TextParts {
    const defaultPart = { text: params.content };

    if (params.role === ROLES.user) {
      const langName = LANGUAGE_MAP[params.examLanguage] || 'English';

      const systemNotes = [
        `[System note: Exam language is ${langName}. Write your ENTIRE reply in ${langName} ` +
          `(question, feedback, headings, and the JSON "message" string). ` +
          `Ignore user typos in other languages; keep ${langName} for the exam.]`,
        `[System note: Remaining attempts: ${params.remainingAttempts}]`,
        params.isQuestionGeneration
          ? `[System note: You MUST ask a question specifically related
        to one of these topics: ${params.selectedTopics}.]`
          : null,
      ].filter(Boolean) as string[];

      return [defaultPart, ...systemNotes.map(note => ({ text: note }))];
    }

    return [defaultPart];
  }
}
