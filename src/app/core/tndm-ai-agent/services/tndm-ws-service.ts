import { computed, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { TndmAuthStateStoreService } from '@auth';
import { User } from '@supabase/supabase-js';
import { ChatWsMessage } from '../types/chat';
import { environment } from '../../../../environments/environment';
import DisconnectReason = Socket.DisconnectReason;
import { TranslocoService } from '@jsverse/transloco';

const WS_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message',
  ASK: 'ask',
  RECONNECT_ATTEMPT: 'reconnect_attempt',
  RECONNECT: 'reconnect',
} as const;

@Injectable({
  providedIn: 'root',
})
export class TndmWsService {
  private readonly authStateService = inject(TndmAuthStateStoreService);
  private readonly translocoService = inject(TranslocoService);

  private readonly reconnectionDelay = 1000;
  private readonly reconnectionDelayMax = 5000;

  private _socket: Socket | null = null;
  private userId: string | null = null;
  private readonly url: string = environment.aiAgentBackendUrl;

  readonly events: WritableSignal<ChatWsMessage[]> = signal<ChatWsMessage[]>([]);
  readonly connected: WritableSignal<boolean> = signal<boolean>(false);

  readonly hasMessages = computed(() => this.events().length > 0);
  readonly lastMessage = computed(() => {
    const list = this.events();
    return list.length > 0 ? list[list.length - 1] : null;
  });

  constructor() {
    effect((): void => {
      const user: User | null = this.authStateService.user();
      const id = user?.id ?? null;

      if (!id) {
        this.resetConnectionState();
        return;
      }

      if (this.userId === id && this.isWSAlive()) {
        return;
      }

      this.connect(id);
    });
  }

  isWSAlive(): boolean {
    return !!this._socket?.connected;
  }

  connect(id: string): void {
    if (this.userId === id && this.isWSAlive()) {
      return;
    }

    this.resetConnectionState();

    this.userId = id;

    this._socket = io(this.url, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: this.reconnectionDelay,
      reconnectionDelayMax: this.reconnectionDelayMax,
      reconnectionAttempts: Infinity,
      query: { sessionId: id },
    });

    this._socket.on(WS_EVENTS.CONNECT, (): void => {
      this.connected.set(true);
      console.info(this.translocoService.translate('ws.connectedMsg'));
    });

    this._socket.on(WS_EVENTS.DISCONNECT, (reason: DisconnectReason): void => {
      this.connected.set(false);
      console.warn(this.translocoService.translate('ws.disconnectedMsg', { reason }));
    });

    this._socket.on(WS_EVENTS.MESSAGE, (data: ChatWsMessage): void => {
      this.events.update((list: ChatWsMessage[]): ChatWsMessage[] => [...list, data]);
    });

    this._socket.io.on(WS_EVENTS.RECONNECT_ATTEMPT, attempt => {
      console.info(this.translocoService.translate('ws.reconnect_attemptMsg', { attempt }));
    });

    this._socket.io.on(WS_EVENTS.RECONNECT, attempt => {
      console.info(this.translocoService.translate('ws.reconnectedMsg', { attempt }));
    });
  }

  send(payload: unknown): void {
    if (!this._socket?.connected) {
      return;
    }
    this._socket.emit(WS_EVENTS.ASK, payload);
  }

  private resetConnectionState(): void {
    if (this._socket) {
      this._socket.removeAllListeners();
      this._socket.io.off(WS_EVENTS.RECONNECT_ATTEMPT);
      this._socket.io.off(WS_EVENTS.RECONNECT);
      this._socket.disconnect();
    }

    this._socket = null;
    this.userId = null;
    this.events.set([]);
    this.connected.set(false);
  }
}
