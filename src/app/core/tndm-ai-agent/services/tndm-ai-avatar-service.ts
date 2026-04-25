import { DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import { TndmAiAvatarSceneService } from './tndm-ai-avatar-scene-service';
import { TndmAiAvatarModelService } from './tndm-ai-avatar-model-service';
import { TndmAiAvatarSpeechService } from './tndm-ai-avatar-speech-service';
import { TndmAiChatService } from './tndm-ai-chat-service';
import { TndmAiAvatarMorphService } from './tndm-ai-avatar-morph-service';

type AvatarViewportSize = {
  width: number;
  height: number;
};

@Injectable({
  providedIn: 'root',
})
export class TndmAiAvatarService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sceneService = inject(TndmAiAvatarSceneService);
  private readonly modelService = inject(TndmAiAvatarModelService);
  private readonly speechService = inject(TndmAiAvatarSpeechService);
  private readonly chatService = inject(TndmAiChatService);
  private readonly morphService = inject(TndmAiAvatarMorphService);

  private animationFrameId: number | null = null;
  private lastTime = 0;
  private initialized = false;

  private readonly _ready = signal(false);
  private readonly ready = this._ready.asReadonly();

  private readonly _size = signal<AvatarViewportSize>({ width: 0, height: 0 });
  readonly size = this._size.asReadonly();

  constructor() {
    this.destroyRef.onDestroy(() => this.destroy());

    effect((): void => {
      this.speechService.setTalking(this.chatService.assistantTyping());
    });
  }

  init(canvas: HTMLCanvasElement): void {
    if (this.initialized) return;

    const host = canvas.parentElement;
    if (!host) return;

    this.sceneService.init(canvas, host, size => this._size.set(size));

    if (!this.sceneService.scene) return;

    this.modelService.load(this.sceneService.scene, data => {
      this.morphService.attachHead(data.headMesh, data.morphDict);
      this._ready.set(true);
    });

    this.startLoop();
    this.initialized = true;
  }

  destroy(): void {
    if (!this.initialized) return;

    this.stopLoop();
    this.speechService.reset();
    this.modelService.destroy();
    this.sceneService.destroy();

    this._ready.set(false);
    this._size.set({ width: 0, height: 0 });
    this.initialized = false;
  }

  private startLoop(): void {
    const tick = (now: number): void => {
      this.animationFrameId = requestAnimationFrame(tick);

      const delta = this.lastTime ? (now - this.lastTime) / 1000 : 0;
      this.lastTime = now;

      if (delta > 0 && delta < 1) {
        this.speechService.update(delta);
      }

      this.sceneService.render();
    };

    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(tick);
  }

  private stopLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.lastTime = 0;
  }
}
