import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { AiExamOllamaService } from './ollama.service';
import { Message, ROLES } from './shared/types';
import { SYSTEM_INSTRUCTION } from './shared/prompts';

type TryCatchRequestParams =
  | { isInitialQuestion: boolean; userAnswer?: string }
  | { isInitialQuestion?: boolean; userAnswer: string };

@Component({
  selector: 'tndm-ai-exam',
  templateUrl: 'ai-exam.html',
  styleUrl: 'ai-exam.scss',
  imports: [TndmButton],
  providers: [AiExamOllamaService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmAiExam {
  private readonly ollama = inject(AiExamOllamaService);
  readonly currentQuestion = signal('');
  readonly isLoading = signal(false);
  readonly isGenerateQuestionDisabled = signal(false);
  readonly isAnswerQuestionDisabled = signal(true);

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

    const userAnswer = String(new FormData(form).get('user-answer'));
    this.tryCatchRequest({ userAnswer });
  }

  private async tryCatchRequest({ isInitialQuestion, userAnswer }: TryCatchRequestParams): Promise<void> {
    this.isLoading.set(true);

    let answerFromAi = null;

    try {
      if (isInitialQuestion) {
        answerFromAi = await this.ollama.ask(this.initialQuestion, this.chatHistory);
        this.updateChatHistory(this.initialQuestion, answerFromAi);
        this.isAnswerQuestionDisabled.set(false);
      } else {
        if (!userAnswer) {
          throw new Error('Message content is NOT provided');
        }
        answerFromAi = await this.ollama.ask(userAnswer, this.chatHistory);
        this.updateChatHistory(userAnswer, answerFromAi);
      }

      this.currentQuestion.set(answerFromAi);
    } catch (error) {
      console.error(`Failed to connect to the AI tutor.`, error);
      this.currentQuestion.set('FAILED to connect to the AI tutor.');
    } finally {
      this.isLoading.set(false);
      // console.log(this.chatHistory);
    }
  }

  private updateChatHistory(questionToAi: string, answerFromAi: string): void {
    this.chatHistory.push({
      role: ROLES.user,
      content: questionToAi,
    });
    this.chatHistory.push({
      role: ROLES.assistant,
      content: answerFromAi,
    });
  }
}
