import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Box3, Scene, SkinnedMesh, Vector3 } from 'three';
import { GLTFLoader } from 'three-stdlib';
import { ToastService } from '../../toast/toast-service';

export type AvatarHeadMorphData = {
  headMesh: SkinnedMesh;
  morphDict: Record<string, number>;
};

@Injectable({
  providedIn: 'root',
})
export class TndmAiAvatarModelService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly toasterService = inject(ToastService);

  private readonly loader = new GLTFLoader();
  private readonly avatarUrl = 'glb/avatar.glb';

  private headMesh: SkinnedMesh | null = null;
  private morphDict: Record<string, number> = {};

  private readonly _ready = signal(false);
  readonly ready = this._ready.asReadonly();

  constructor() {
    this.destroyRef.onDestroy(() => this.destroy());
  }

  load(scene: Scene, onHeadReady?: (data: AvatarHeadMorphData) => void): void {
    this._ready.set(false);

    this.loader.load(
      this.avatarUrl,
      gltf => {
        scene.add(gltf.scene);

        const box = new Box3().setFromObject(gltf.scene);
        const center = box.getCenter(new Vector3());
        const size = box.getSize(new Vector3());

        gltf.scene.position.x = -center.x;
        gltf.scene.position.z = -center.z;

        const headTopY = box.max.y;
        const headBottomY = center.y + size.y * 0.15;
        const eyesY = (headTopY + headBottomY) / 2;

        gltf.scene.position.y = -eyesY;

        gltf.scene.traverse(child => {
          const mesh = child as SkinnedMesh;

          if (mesh.name !== 'Wolf3D_Head') return;

          this.headMesh = mesh;
          this.morphDict = mesh.morphTargetDictionary ?? {};
        });

        this._ready.set(true);

        if (this.headMesh) {
          onHeadReady?.({
            headMesh: this.headMesh,
            morphDict: this.morphDict,
          });
        }
      },
      undefined,
      error => {
        this.toasterService.warning('Loading error', `Error loading avatar model: ${error.message}`);
        this._ready.set(false);
      }
    );
  }

  destroy(): void {
    this.headMesh = null;
    this.morphDict = {};
    this._ready.set(false);
  }
}
