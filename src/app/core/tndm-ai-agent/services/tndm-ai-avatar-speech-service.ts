import { DestroyRef, inject, Injectable } from '@angular/core';
import { TndmAiAvatarMorphService } from './tndm-ai-avatar-morph-service';

export const AVATAR_SPEECH_MORPH = {
  mouthOpen: 'mouthOpen',
  jawOpen: 'jawOpen',
  mouthClose: 'mouthClose',
} as const;

export type AvatarSpeechMorphName = (typeof AVATAR_SPEECH_MORPH)[keyof typeof AVATAR_SPEECH_MORPH];

@Injectable({
  providedIn: 'root',
})
export class TndmAiAvatarSpeechService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly morphService = inject(TndmAiAvatarMorphService);

  private talking = false;
  private phase = 0;

  constructor() {
    this.destroyRef.onDestroy(() => this.reset());
  }

  setTalking(value: boolean): void {
    this.talking = value;
  }

  update(delta: number): void {
    if (this.talking) {
      this.phase += delta * 12;

      const mouth = (Math.sin(this.phase) + 1) * 0.4;
      const jaw = (Math.sin(this.phase) + 1) * 0.35;

      this.morphService.setMorph(AVATAR_SPEECH_MORPH.mouthOpen, mouth, 0.25);
      this.morphService.setMorph(AVATAR_SPEECH_MORPH.jawOpen, jaw, 0.25);
      this.morphService.setMorph(AVATAR_SPEECH_MORPH.mouthClose, 0, 0.2);
      return;
    }

    this.morphService.setMorph(AVATAR_SPEECH_MORPH.mouthOpen, 0, 0.2);
    this.morphService.setMorph(AVATAR_SPEECH_MORPH.jawOpen, 0, 0.2);
  }

  reset(): void {
    this.morphService.resetMorphs([
      AVATAR_SPEECH_MORPH.mouthOpen,
      AVATAR_SPEECH_MORPH.jawOpen,
      AVATAR_SPEECH_MORPH.mouthClose,
    ]);
    this.talking = false;
    this.phase = 0;
  }
}
