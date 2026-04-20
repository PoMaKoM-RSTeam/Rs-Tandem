import { inject, Injectable, signal } from '@angular/core';
import { UserService } from '../../core/services/user-service/user-api.service';
import { ToastService } from '../../core/toast/toast-service';
import { ProfileUpdates } from './tndm-user-profiles.types';

@Injectable({ providedIn: 'root' })
export class TndmUserProfileService {
  private readonly userService = inject(UserService);
  private readonly toaster = inject(ToastService);

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

  async saveProfile(updates: ProfileUpdates): Promise<boolean> {
    try {
      await this.userService.updateUserInfo(updates);
      this._isEditMode.set(false);
      return true;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Update failed';
      this.toaster.danger('Error', errorMsg);
      return false;
    }
  }
}
