import { effect, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ChatMessage, ChatRole, ChatWsMessage } from '../types/chat';
import { TndmWsService } from './tndm-ws-service';
import { uuid } from '../helpers/uuid';

@Injectable({
  providedIn: 'root',
})
export class TndmAiChatService {
  private readonly wsService = inject(TndmWsService);

  private readonly _messages: WritableSignal<ChatMessage[]> = signal<ChatMessage[]>([]);
  readonly messages: Signal<ChatMessage[]> = this._messages.asReadonly();

  private readonly _loading: WritableSignal<boolean> = signal(false);
  readonly loading: Signal<boolean> = this._loading.asReadonly();

  private readonly _assistantTyping: WritableSignal<boolean> = signal(false);
  readonly assistantTyping: Signal<boolean> = this._assistantTyping.asReadonly();

  private readonly _currentAssistantId: WritableSignal<string | null> = signal(null);
  readonly currentAssistantId: Signal<string | null> = this._currentAssistantId.asReadonly();

  private readonly _error = signal<string | null>(null);

  constructor() {
    effect((): void => {
      const lastMessage = this.wsService.lastMessage();

      if (!lastMessage) return;

      this.handleWSMessage(lastMessage);
    });
  }

  private handleWSMessage(msg: ChatWsMessage): void {
    if (msg.type === 'chunk') {
      this.appendAssistantChunk(msg.text ?? '');
      return;
    }

    if (msg.type === 'done') {
      this.finishAssistantTurn();
    }

    if (msg.type === 'error') {
      this.handleError(msg);
    }
  }

  private handleError(msg: Extract<ChatWsMessage, { type: 'error' }>): void {
    this.finishAssistantTurn();

    const errorText = msg.message ?? 'Unexpected error';
    this._error.set(errorText);

    const errorMessage: ChatMessage = this.buildMessage('assistant', `⚠️ ${errorText}`);
    this._messages.update(list => [...list, errorMessage]);
  }

  clearMessages(): void {
    this._messages.set([]);
  }

  private buildMessage(role: ChatRole, text: string, id: string = uuid()): ChatMessage {
    return {
      id,
      role,
      text,
      createdAt: new Date(),
    };
  }

  ask(prompt: string): void {
    const text = prompt.trim();

    if (!text) {
      return;
    }

    this._error.set(null);

    const userMessage: ChatMessage = this.buildMessage('user', text);

    const assistantMessage: ChatMessage = this.buildMessage('assistant', '');

    this._currentAssistantId.set(assistantMessage.id);
    this._messages.update((list: ChatMessage[]): ChatMessage[] => [...list, userMessage, assistantMessage]);

    this._loading.set(true);
    this._assistantTyping.set(true);

    this.wsService.send({ prompt: text });
  }

  private appendAssistantChunk(text: string): void {
    if (!text) {
      return;
    }

    const currentAssistantId = this._currentAssistantId();

    if (!currentAssistantId) {
      const msg: ChatMessage = this.buildMessage('assistant', text);

      this._currentAssistantId.set(msg.id);
      this._messages.update((listMessages: ChatMessage[]): ChatMessage[] => [...listMessages, msg]);
      return;
    }

    this._messages.update((list: ChatMessage[]): ChatMessage[] => {
      const exists = list.some(message => message.id === currentAssistantId);

      if (!exists) {
        const msg: ChatMessage = this.buildMessage('assistant', text, currentAssistantId);
        return [...list, msg];
      }

      return list.map(
        (message: ChatMessage): ChatMessage =>
          message.id === currentAssistantId ? { ...message, text: message.text + text } : message
      );
    });
  }

  private finishAssistantTurn(): void {
    this._loading.set(false);
    this._assistantTyping.set(false);
    this._currentAssistantId.set(null);
  }
}
