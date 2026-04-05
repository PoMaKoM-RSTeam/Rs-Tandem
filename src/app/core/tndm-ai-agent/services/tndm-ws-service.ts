import { DestroyRef, effect, inject, Injectable, signal, WritableSignal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { TndmAuthStateStoreService } from '@auth';
import { User } from '@supabase/supabase-js';
import { ChatWsMessage } from '../types/chat';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TndmWsService {
  private destroyRef = inject(DestroyRef);
  private readonly authStateService = inject(TndmAuthStateStoreService);

  private socket: Socket | null = null;
  private userId: string | null = null;
  private url: string = environment.aiAgentBackendUrl;

  readonly events: WritableSignal<ChatWsMessage[]> = signal<ChatWsMessage[]>([]);
  readonly connected: WritableSignal<boolean> = signal<boolean>(false);

  constructor() {
    effect((): void => {
      const user: User | null = this.authStateService.user();

      if (!user) {
        this.resetConnectionState();
        return;
      }

      if (this.userId === user.id && this.isWSAlive()) {
        return;
      }

      this.resetConnectionState();
      this.connect(user.id);
    });

    this.destroyRef.onDestroy((): void => {
      this.resetConnectionState();
    });
  }

  private isWSAlive(): boolean {
    return !!this.socket && this.socket.connected;
  }

  connect(id: string): void {
    if (this.userId && this.isWSAlive()) {
      return;
    }

    this.events.set([]);

    this.userId = id;

    this.socket = io(this.url, {
      query: { sessionId: this.userId },
      transports: ['websocket'],
    });

    this.socket.on('connect', (): void => {
      this.connected.set(true);
    });

    this.socket.on('disconnect', (): void => {
      this.connected.set(false);
    });

    this.socket.on('message', (data: ChatWsMessage): void => {
      this.events.update((list: ChatWsMessage[]): ChatWsMessage[] => [...list, data]);
    });
  }

  send(payload: unknown): void {
    if (!this.socket || !this.socket.connected) {
      return;
    }
    this.socket.emit('ask', payload);
  }

  clearEvents(): void {
    this.events.set([]);
  }

  private resetConnectionState(): void {
    this.socket?.disconnect();
    this.socket = null;
    this.userId = null;
    this.events.set([]);
    this.connected.set(false);
  }
}
