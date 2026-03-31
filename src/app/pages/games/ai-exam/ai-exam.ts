import { ChangeDetectionStrategy, Component, ElementRef, inject, OnDestroy, signal, viewChild } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { GeminiService } from './services/gemini/gemini.service';
import { ExamLanguage, GeminiResponse, ROLES } from './shared/types';
import { TndmToaster } from '../../../shared/ui/tndm-toaster/tndm-toaster';
import { ToastService } from '../../../core/toast/toast-service';
import { TndmChat } from './components/chat/chat';
import { ANSWER_ATTEMPTS, JS_TOPICS } from './services/gemini/prompt';
import { shuffle } from 'lodash';
import { DatabaseService } from './services/database.service';
import { TranslocoPipe } from '@jsverse/transloco';
import { LanguagePreferenceService } from '../../../core/i18n/language-preferences.service';

type AskAiParams = {
  messageContent: string;
  examLanguage: ExamLanguage;
  isQuestionGeneration: boolean;
  selectedTopics?: string;
  isQuestionSkipping?: true;
};

type AskAiResult =
  | {
      status: 'ok';
      message: string;
    }
  | {
      status: 'error';
      errorMessage: string;
    };

type GenerateQuestionParams = {
  isQuestionSkipping?: true;
};

type GenerateQuestionResult =
  | {
      status: 'early-return';
    }
  | {
      status: 'error';
      errorMessage: string;
    }
  | {
      status: 'ok';
      question: string;
    };

type FinishExamParams = {
  isExamPassed: boolean;
  score: number;
};

type ProcessApiResponseParams = {
  isQuestionGeneration: boolean;
  isQuestionSkipping?: true;
  response: GeminiResponse;
};

type SetFinishExamStateParams = {
  isExamPassed: boolean;
};

@Component({
  selector: 'tndm-ai-exam',
  templateUrl: 'ai-exam.html',
  styleUrl: 'ai-exam.scss',
  imports: [TndmButton, TndmToaster, TndmChat, TranslocoPipe],
  providers: [GeminiService, DatabaseService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmAiExam implements OnDestroy {
  private readonly gemini = inject(GeminiService);
  private readonly toaster = inject(ToastService);
  private readonly database = inject(DatabaseService);
  private readonly languagePreferenceService = inject(LanguagePreferenceService);

  private readonly chat = viewChild(TndmChat);
  private readonly textInput = viewChild<ElementRef<HTMLTextAreaElement>>('textInput');

  readonly isLoading = signal(false);
  readonly isGenerateQuestionDisabled = signal(false);
  readonly isAnswerQuestionDisabled = signal(true);
  readonly isSkipQuestionDisabled = signal(true);
  readonly isExamFinished = signal(false);

  readonly MAX_ALLOWED_ATTEMPTS = ANSWER_ATTEMPTS;
  readonly attemptsLeft = signal(this.MAX_ALLOWED_ATTEMPTS);

  readonly currentQuestion = signal<string | null>(null);
  private readonly initialQuestions: Record<ExamLanguage, string> = {
    ru: `Задай вопрос про JavaScript`,
    en: `Ask a question on JavaScript`,
  };

  readonly examLanguage = signal<ExamLanguage>('en');

  readonly SKIP_QUESTION_TIMEOUT_SECONDS = 4;
  readonly skipQuestionSeconds = signal(this.SKIP_QUESTION_TIMEOUT_SECONDS);
  skipQuestionSubscription: Subscription | null = null;

  async generateQuestion({ isQuestionSkipping }: GenerateQuestionParams = {}): Promise<GenerateQuestionResult> {
    if (this.isLoading()) return { status: 'early-return' };

    const language = this.languagePreferenceService.activeLang();
    this.setPreQuestionGenerationState(language);

    const shuffledTopics = shuffle(JS_TOPICS);
    const selectedTopics = shuffledTopics.slice(0, 3).join(', ');

    const response = await this.askAi({
      messageContent: this.initialQuestions[language],
      examLanguage: language,
      isQuestionGeneration: true,
      selectedTopics,
      isQuestionSkipping,
    });

    if (response.status === 'ok') {
      this.isGenerateQuestionDisabled.set(true);
      this.currentQuestion.set(response.message);
      return { status: 'ok', question: response.message };
    }

    return { status: 'error', errorMessage: response.errorMessage };
  }

  async answerQuestion(event: Event): Promise<void> {
    event.preventDefault();

    const examLanguage = this.examLanguage();
    if (!examLanguage) throw new Error('Exam language is not set');

    const form = event.target;
    if (!(form instanceof HTMLFormElement)) throw new Error('HTMLFormElement expected');

    const textInputElement = form.querySelector('#user-answer');
    if (!(textInputElement instanceof HTMLTextAreaElement)) throw new Error('HTMLTextAreaElement expected');

    const userAnswer = new FormData(form).get('user-answer')?.toString();
    if (userAnswer === undefined || userAnswer === '') {
      if (!this.isLoading()) this.toaster.info(`Message required`, `Provide a message to AI`);
      return;
    }

    this.askAi({ messageContent: userAnswer, isQuestionGeneration: false, examLanguage });
  }

  private async askAi({
    messageContent,
    examLanguage,
    isQuestionGeneration,
    selectedTopics,
    isQuestionSkipping,
  }: AskAiParams): Promise<AskAiResult> {
    const { chat, textInput } = this.getUiChatElements();

    this.setPreRequestState(textInput);

    try {
      chat.updateChatHistory({
        role: ROLES.user,
        content: messageContent,
        examLanguage,
        remainingAttempts: this.attemptsLeft(),
        isQuestionGeneration,
        selectedTopics,
      });
      const response = await this.gemini.ask(chat.allMessages());
      chat.updateChatHistory({ role: ROLES.model, content: response.message });

      return this.processApiResponse({ isQuestionGeneration, isQuestionSkipping, response });
    } catch (error) {
      return this.processApiError(error);
    } finally {
      this.setAfterRequestState();
    }
  }

  private async finishExam({ isExamPassed, score }: FinishExamParams): Promise<void> {
    const error = await this.database.uploadExamResults({
      attemptsUsed: this.MAX_ALLOWED_ATTEMPTS - this.attemptsLeft(),
      question: this.currentQuestion(),
      maxAllowedAttempts: this.MAX_ALLOWED_ATTEMPTS,
      isExamPassed,
      score,
    });

    if (error) {
      this.toaster.warning(`Failed to save results to DB`, error.message);
      console.error(error);
    }

    this.setFinishExamState({ isExamPassed });
  }

  private focusTextInput(): void {
    requestAnimationFrame(() => {
      const textInput = this.textInput()?.nativeElement;
      if (!textInput) return;
      textInput.focus();
    });
  }

  onTextInputKeydown(event: KeyboardEvent, form: HTMLFormElement): void {
    if (event.key !== 'Enter' || event.shiftKey) return;
    if (this.isLoading() || this.isAnswerQuestionDisabled()) return;

    event.preventDefault();
    form.requestSubmit();
  }

  private getUiChatElements(): { chat: TndmChat; textInput: HTMLTextAreaElement } {
    const chat = this.chat();
    const textInput = this.textInput()?.nativeElement;
    if (!chat) throw new Error('Chat element not found');
    if (!textInput) throw new Error('textInput element not found');

    return { chat, textInput };
  }

  private setPreQuestionGenerationState(language: ExamLanguage): void {
    this.isExamFinished.set(false);
    this.chat()?.resetChatHistory();
    this.examLanguage.set(language);
  }

  private setPreRequestState(textInput: HTMLTextAreaElement): void {
    this.isLoading.set(true);
    textInput.value = '';
  }

  private setFinishExamState({ isExamPassed }: SetFinishExamStateParams): void {
    this.isAnswerQuestionDisabled.set(true);
    this.isSkipQuestionDisabled.set(true);
    this.isGenerateQuestionDisabled.set(false);
    this.isExamFinished.set(true);
    this.attemptsLeft.set(this.MAX_ALLOWED_ATTEMPTS);

    if (isExamPassed) {
      this.toaster.success(`Exam finished 🥳`, `You passed!`);
    } else {
      this.toaster.info(`You didn't make it 😢`, `Good luck next time`);
    }
  }

  private setAfterRequestState(): void {
    this.isLoading.set(false);
    if (!this.isAnswerQuestionDisabled()) this.focusTextInput();
  }

  private processApiResponse({
    isQuestionGeneration,
    isQuestionSkipping,
    response,
  }: ProcessApiResponseParams): AskAiResult {
    console.log(response);

    if (isQuestionGeneration) {
      this.isAnswerQuestionDisabled.set(false);
      if (!isQuestionSkipping) this.isSkipQuestionDisabled.set(false);
    }

    if (!isQuestionGeneration && this.attemptsLeft() >= 1) this.attemptsLeft.update(attempts => attempts - 1);

    if (response.isExamFinished) this.finishExam({ isExamPassed: response.isExamPassed, score: response.score });

    return { status: 'ok', message: response.message };
  }

  private processApiError(error: unknown): AskAiResult {
    this.toaster.warning(`API error`, `Failed to send request`);
    this.stopSkipQuestionTimeout();

    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(errorMessage);

    return { status: 'error', errorMessage };
  }

  private startSkipQuestionTimeout(): void {
    if (this.skipQuestionSubscription) return;

    this.skipQuestionSubscription = interval(1000).subscribe(() => {
      if (this.skipQuestionSeconds() <= 0) {
        this.stopSkipQuestionTimeout();
      } else {
        this.skipQuestionSeconds.update(seconds => seconds - 1);
      }
    });
  }

  private stopSkipQuestionTimeout(): void {
    this.skipQuestionSubscription?.unsubscribe();
    this.skipQuestionSubscription = null;
    this.isSkipQuestionDisabled.set(false);
    this.skipQuestionSeconds.set(this.SKIP_QUESTION_TIMEOUT_SECONDS);
  }

  async skipQuestion(): Promise<void> {
    if (this.isLoading()) return;

    this.isSkipQuestionDisabled.set(true);

    const result = await this.generateQuestion({ isQuestionSkipping: true });

    switch (result.status) {
      case 'ok':
        this.startSkipQuestionTimeout();
        break;
      case 'error':
        this.isSkipQuestionDisabled.set(false);
        break;
    }
  }

  ngOnDestroy(): void {
    this.stopSkipQuestionTimeout();
  }
}
