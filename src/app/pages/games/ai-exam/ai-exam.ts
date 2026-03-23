import { ChangeDetectionStrategy, Component, inject, signal, viewChild } from '@angular/core';
import { TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { AiExamOllamaService } from './ollama.service';
import { Message, ROLES } from './shared/types';
import { SYSTEM_INSTRUCTION } from './shared/prompts';
import { TndmToaster } from '../../../shared/ui/tndm-toaster/tndm-toaster';
import { ToastService } from '../../../core/toast/toast-service';
import { TndmChat } from './components/chat/chat';

type TryCatchRequestConfig =
  | { isInitialQuestion: boolean; userAnswer?: string; textInputElement?: HTMLTextAreaElement }
  | { isInitialQuestion?: boolean; userAnswer: string; textInputElement: HTMLTextAreaElement };

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

  // readonly currentQuestion = signal('');

  readonly isLoading = signal(false);
  readonly isGenerateQuestionDisabled = signal(false);
  readonly isAnswerQuestionDisabled = signal(true);
  readonly isSkipQuestionDisabled = signal(true);
  readonly isTextInputDisabled = signal(true);

  private readonly chatHistory: Message[] = [{ role: ROLES.system, content: SYSTEM_INSTRUCTION }];
  private readonly initialQuestion = `Ask me a question on JavaScript`;

  async generateQuestion(): Promise<void> {
    if (this.isLoading()) {
      return;
    }

    this.tryCatchRequest({ isInitialQuestion: true });
    this.isGenerateQuestionDisabled.set(true);
  }

  async answerQuestion(event: Event): Promise<void> {
    event.preventDefault();

    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('HTMLFormElement expected');
    }

    const textInputElement = form.querySelector('#user-answer');
    if (!(textInputElement instanceof HTMLTextAreaElement)) {
      throw new Error('HTMLTextAreaElement expected');
    }

    const userAnswer = new FormData(form).get('user-answer')?.toString();
    if (userAnswer === undefined || userAnswer === '') {
      if (!this.isLoading()) {
        this.toaster.info(`Message required`, `Provide a message to AI`);
      }
      return;
    }

    this.tryCatchRequest({ userAnswer, textInputElement });
  }

  private async tryCatchRequest({
    isInitialQuestion,
    userAnswer,
    textInputElement,
  }: TryCatchRequestConfig): Promise<void> {
    const chat = this.chat();
    if (!chat) {
      throw new Error('Chat element not found');
    }

    this.isLoading.set(true);

    let answerFromAi = null;

    try {
      if (isInitialQuestion) {
        chat.updateChatHistory({ role: ROLES.user, content: this.initialQuestion });
        answerFromAi = await this.ollama.ask(this.initialQuestion, chat.allMessages());
        chat.updateChatHistory({ role: ROLES.assistant, content: answerFromAi });

        this.isAnswerQuestionDisabled.set(false);
        this.isSkipQuestionDisabled.set(false);
        this.isTextInputDisabled.set(false);
      } else {
        if (!userAnswer) {
          throw new Error('Message content is NOT provided');
        }
        chat.updateChatHistory({ role: ROLES.user, content: userAnswer });
        answerFromAi = await this.ollama.ask(userAnswer, chat.allMessages());
        chat.updateChatHistory({ role: ROLES.assistant, content: answerFromAi });
      }

      if (textInputElement) {
        textInputElement.value = '';
      }
    } catch (error) {
      this.toaster.warning(`API error`, `Failed to send request`);
      console.error(error);
    } finally {
      this.isLoading.set(false);
      console.log(chat.allMessages());
    }
  }
}
