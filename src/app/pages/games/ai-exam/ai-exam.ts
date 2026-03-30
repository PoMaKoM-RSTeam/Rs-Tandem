import { ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { GeminiService } from './gemini.service';
import { ROLES } from './shared/types';
import { TndmToaster } from '../../../shared/ui/tndm-toaster/tndm-toaster';
import { ToastService } from '../../../core/toast/toast-service';
import { TndmChat } from './components/chat/chat';
import { ANSWER_ATTEMPTS, JS_TOPICS } from './shared/prompt';
import { shuffle } from 'lodash';

type AskAiParams = {
  messageContent?: string;
  isGeneratingQuestion: boolean;
  selectedTopics?: string;
};

@Component({
  selector: 'tndm-ai-exam',
  templateUrl: 'ai-exam.html',
  styleUrl: 'ai-exam.scss',
  imports: [TndmButton, TndmToaster, TndmChat],
  providers: [GeminiService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmAiExam {
  private readonly gemini = inject(GeminiService);
  private readonly toaster = inject(ToastService);
  private readonly chat = viewChild(TndmChat);
  private readonly textInput = viewChild<ElementRef<HTMLTextAreaElement>>('textInput');

  readonly isLoading = signal(false);
  readonly isGenerateQuestionDisabled = signal(false);
  readonly isAnswerQuestionDisabled = signal(true);
  readonly isSkipQuestionDisabled = signal(true);
  readonly isExamFinished = signal(false);

  readonly MAX_ATTEMPT_NUMBER = ANSWER_ATTEMPTS;
  readonly currentAttempt = signal(this.MAX_ATTEMPT_NUMBER);

  private readonly initialQuestion = `Задай вопрос про JavaScript`;

  async generateQuestion(): Promise<void> {
    if (this.isLoading()) return;

    this.isExamFinished.set(false);
    this.chat()?.resetChatHistory();

    const shuffled = shuffle(JS_TOPICS);
    const selectedTopics = shuffled.slice(0, 3).join(', ');

    const isGenerateSuccessfully = await this.askAi({ isGeneratingQuestion: true, selectedTopics });
    if (isGenerateSuccessfully) this.isGenerateQuestionDisabled.set(true);
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

    this.askAi({ messageContent: userAnswer, isGeneratingQuestion: false });
  }

  onTextareaKeydown(event: KeyboardEvent, form: HTMLFormElement): void {
    if (event.key !== 'Enter' || event.shiftKey) return;
    if (this.isLoading() || this.isAnswerQuestionDisabled()) return;

    event.preventDefault();
    form.requestSubmit();
  }

  private async askAi({
    messageContent = this.initialQuestion,
    isGeneratingQuestion,
    selectedTopics,
  }: AskAiParams): Promise<boolean> {
    const chat = this.chat();
    const textInput = this.textInput()?.nativeElement;
    if (!chat) throw new Error('Chat element not found');
    if (!textInput) throw new Error('textInput element not found');

    this.isLoading.set(true);
    textInput.value = '';

    try {
      chat.updateChatHistory({
        role: ROLES.user,
        content: messageContent,
        remainingAttempts: this.currentAttempt(),
        isGeneratingQuestion: isGeneratingQuestion,
        selectedTopics,
      });
      const response = await this.gemini.ask(chat.allMessages());
      chat.updateChatHistory({ role: ROLES.model, content: response.message });
      console.log(response);

      if (isGeneratingQuestion) {
        this.isAnswerQuestionDisabled.set(false);
        this.isSkipQuestionDisabled.set(false);
      } else if (this.currentAttempt() >= 1) {
        this.currentAttempt.update(attempt => (attempt -= 1));
      }

      if (response.isExamFinished) {
        this.isAnswerQuestionDisabled.set(true);
        this.isSkipQuestionDisabled.set(true);
        this.isGenerateQuestionDisabled.set(false);
        this.isExamFinished.set(true);
        this.currentAttempt.set(this.MAX_ATTEMPT_NUMBER);
        this.toaster.info(`Exam finished!`, `Check your final score.`);
      }

      return true;
    } catch (error) {
      this.toaster.warning(`API error`, `Failed to send request`);
      console.error(error);
      return false;
    } finally {
      this.isLoading.set(false);
      if (!this.isAnswerQuestionDisabled()) this.focusAnswerTextarea();
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
