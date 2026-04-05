import { DestroyRef, effect, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { ChatMessage, ChatRole, ChatWsMessage } from '../types/chat';
import { TndmWsService } from './tndm-ws-service';
import { uuid } from '../helpers/uuid';

@Injectable({
  providedIn: 'root',
})
export class TndmAiChatService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly wsService = inject(TndmWsService);

  private readonly _messages: WritableSignal<ChatMessage[]> = signal<ChatMessage[]>([]);
  readonly messages: Signal<ChatMessage[]> = this._messages.asReadonly();

  private readonly _loading: WritableSignal<boolean> = signal(false);
  readonly loading: Signal<boolean> = this._loading.asReadonly();

  private readonly _assistantTyping: WritableSignal<boolean> = signal(false);
  readonly assistantTyping: Signal<boolean> = this._assistantTyping.asReadonly();

  private readonly _currentAssistantId: WritableSignal<string | null> = signal(null);
  readonly currentAssistantId: Signal<string | null> = this._currentAssistantId.asReadonly();

  constructor() {
    effect((): void => {
      const events = this.wsService.events();
      const last = events.at(-1);

      if (!last) {
        return;
      }

      this.handleWSMessage(last);
    });

    this.destroyRef.onDestroy((): void => {
      this.reset();
    });
  }

  handleWSMessage(msg: ChatWsMessage): void {
    if (msg.type === 'chunk') {
      this.appendAssistantChunk(msg.text ?? '');
      return;
    }

    if (msg.type === 'done' || msg.type === 'error') {
      this.finishAssistantTurn();
    }
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

    this._messages.update((list: ChatMessage[]): ChatMessage[] => {
      const currentAssistantId = this._currentAssistantId();

      if (!currentAssistantId) {
        const msg: ChatMessage = this.buildMessage('assistant', text);

        this._currentAssistantId.set(msg.id);
        return [...list, msg];
      }

      const idx = list.findIndex(m => m.id === currentAssistantId);
      if (idx === -1) {
        const msg: ChatMessage = this.buildMessage('assistant', text, currentAssistantId);

        return [...list, msg];
      }

      const target = list[idx];
      const updated: ChatMessage = {
        ...target,
        text: target.text + text,
      };

      return [...list.slice(0, idx), updated, ...list.slice(idx + 1)];
    });
  }

  private finishAssistantTurn(): void {
    this._loading.set(false);
    this._assistantTyping.set(false);
    this._currentAssistantId.set(null);
  }

  private reset(): void {
    this._loading.set(false);
    this._assistantTyping.set(false);
    this._currentAssistantId.set(null);
    this._messages.set([]);
  }
}
