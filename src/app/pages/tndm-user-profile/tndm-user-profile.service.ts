import { inject, Injectable, signal } from '@angular/core';
import { UserService } from '../../core/services/user-service/user-api.service';
import { ProfileUpdates } from './tndm-user-profiles.types';
import { LoadingOverlayService } from '../../core/loading-overlay/loading-overlay-service';

@Injectable({ providedIn: 'root' })
export class TndmUserProfileService {
  private readonly userService = inject(UserService);
  private readonly loaderService = inject(LoadingOverlayService);

  private readonly _isOpen = signal(false);
  private readonly _isEditMode = signal(false);

  readonly isOpen = this._isOpen.asReadonly();
  readonly isEditMode = this._isEditMode.asReadonly();

  open(): void {
    this._isOpen.set(true);
    this._isEditMode.set(false);
    document.body.style.overflow = 'hidden';
  }

  close(): void {
    this._isOpen.set(false);
    document.body.style.overflow = 'auto';
  }

  toggleEditMode(): void {
    this._isEditMode.update(v => !v);
  }

  async saveChanges(updates: ProfileUpdates): Promise<void> {
    this.loaderService.show();

    try {
      const tasks: Promise<void>[] = [];

      if (updates.displayName || updates.bio !== undefined) {
        tasks.push(
          this.userService.updateProfile({
            displayName: updates.displayName,
            bio: updates.bio,
          })
        );
      }

      if (updates.password) {
        tasks.push(this.userService.updatePassword(updates.password));
      }

      await Promise.all(tasks);

      this.toggleEditMode();
    } finally {
      this.loaderService.hide();
    }
  }
}
