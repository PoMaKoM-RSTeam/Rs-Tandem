import { Injectable } from '@angular/core';
import { MathUtils, SkinnedMesh } from 'three';

export type AvatarMorphMap = Record<string, number>;
export type AvatarMorphPreset = Record<string, number>;

@Injectable({
  providedIn: 'root',
})
export class TndmAiAvatarMorphService {
  private headMesh: SkinnedMesh | null = null;
  private morphDict: AvatarMorphMap = {};

  attachHead(headMesh: SkinnedMesh, morphDict: AvatarMorphMap): void {
    this.headMesh = headMesh;
    this.morphDict = morphDict;
  }

  detachHead(): void {
    this.headMesh = null;
    this.morphDict = {};
  }

  hasMorph(name: string): boolean {
    return this.morphDict[name] !== undefined;
  }

  setMorph(name: string, target: number, alpha = 1): void {
    const influences = this.headMesh?.morphTargetInfluences;
    if (!influences) return;

    const index = this.morphDict[name];
    if (index === undefined) return;

    const current = influences[index] ?? 0;

    influences[index] = MathUtils.lerp(current, MathUtils.clamp(target, 0, 1), alpha);
  }

  setMorphs(preset: AvatarMorphPreset, alpha = 1): void {
    for (const name of Object.keys(preset)) {
      const value = preset[name];
      if (value === undefined) continue;
      this.setMorph(name, value, alpha);
    }
  }

  resetMorphs(names?: string[]): void {
    const morphNames = names ?? Object.keys(this.morphDict);

    for (const name of morphNames) {
      this.setMorph(name, 0, 1);
    }
  }
}
