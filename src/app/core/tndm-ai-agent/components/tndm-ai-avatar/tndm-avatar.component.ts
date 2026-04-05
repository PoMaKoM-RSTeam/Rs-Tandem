import { ChangeDetectionStrategy, Component, DestroyRef, effect, ElementRef, inject, viewChild } from '@angular/core';
import { TndmAiAvatarService } from '../../services/tndm-ai-avatar-service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-ai-avatar',
  templateUrl: './tndm-avatar.component.html',
  styleUrl: './tndm-avatar.component.scss',
  standalone: true,
})
export class TndmAvatar {
  private readonly destroyRef = inject(DestroyRef);
  private readonly avatarService = inject(TndmAiAvatarService);

  readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    effect((): void => {
      const canvas = this.canvasRef().nativeElement;
      this.avatarService.init(canvas);
    });

    this.destroyRef.onDestroy((): void => {
      this.avatarService.destroy();
    });
  }
}
