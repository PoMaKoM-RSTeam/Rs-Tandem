import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { AiExamOllamaService } from './ollama.service';
import { ROLES } from './shared/types';
import { TndmToaster } from '../../../shared/ui/tndm-toaster/tndm-toaster';
import { ToastService } from '../../../core/toast/toast-service';
import { TndmChat } from './components/chat/chat';

@Component({
  selector: 'tndm-ai-exam',
  templateUrl: 'ai-exam.html',
  styleUrl: 'ai-exam.scss',
  imports: [TndmButton, TndmToaster, TndmChat],
  providers: [AiExamOllamaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmAiExam {
  private readonly ollama = inject(AiExamOllamaService);
  private readonly toaster = inject(ToastService);
  private readonly chat = viewChild(TndmChat);
  private readonly textInput = viewChild<ElementRef<HTMLTextAreaElement>>('textInput');

  readonly isLoading = signal(false);
  readonly isGenerateQuestionDisabled = signal(false);
  readonly isAnswerQuestionDisabled = signal(true);
  readonly isSkipQuestionDisabled = signal(true);
  readonly isTextInputDisabled = signal(true);

  private readonly initialQuestion = `Ask a question on JavaScript`;

  async generateQuestion(): Promise<void> {
    if (this.isLoading()) return;

    this.askAi(this.initialQuestion, 'is-initial-question');
    this.isGenerateQuestionDisabled.set(true);
  }

  async answerQuestion(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target;
    if (!(form instanceof HTMLFormElement)) throw new Error('HTMLFormElement expected');

    const textInputElement = form.querySelector('#user-answer');
    if (!(textInputElement instanceof HTMLTextAreaElement)) throw new Error('HTMLTextAreaElement expected');

    const userAnswer = new FormData(form).get('user-answer')?.toString();
    if (userAnswer === undefined || userAnswer === '') {
      if (!this.isLoading()) this.toaster.info(`Message required`, `Provide a message to AI`);
      return;
    }

    this.askAi(userAnswer);
  }

  onTextareaKeydown(event: KeyboardEvent, form: HTMLFormElement): void {
    if (event.key !== 'Enter' || event.shiftKey) return;
    if (this.isLoading() || this.isTextInputDisabled()) return;

    event.preventDefault();
    form.requestSubmit();
  }

  private async askAi(content: string, isInitialQuestion?: 'is-initial-question'): Promise<void> {
    const chat = this.chat();
    const textInput = this.textInput()?.nativeElement;
    if (!chat) throw new Error('Chat element not found');
    if (!textInput) throw new Error('textInput element not found');

    this.isLoading.set(true);
    textInput.value = '';

    const isFirstMessage = isInitialQuestion === 'is-initial-question';
    const messageContent = isFirstMessage ? this.initialQuestion : content;

    try {
      chat.updateChatHistory({ role: ROLES.user, content: messageContent });
      const answerFromAi = await this.ollama.ask(messageContent, chat.allMessages());
      chat.updateChatHistory({ role: ROLES.assistant, content: answerFromAi });

      if (isFirstMessage) {
        this.isAnswerQuestionDisabled.set(false);
        this.isSkipQuestionDisabled.set(false);
        this.isTextInputDisabled.set(false);
      }
    } catch (error) {
      this.toaster.warning(`API error`, `Failed to send request`);
      console.error(error);
    } finally {
      this.isLoading.set(false);
      this.focusAnswerTextarea();
    }
  }

  private focusAnswerTextarea(): void {
    requestAnimationFrame(() => {
      const textInput = this.textInput()?.nativeElement;
      if (!textInput) return;
      textInput.focus();
    });
  }
}
