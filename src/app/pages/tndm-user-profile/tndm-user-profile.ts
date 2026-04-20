import { ChangeDetectionStrategy, Component, effect, HostListener, inject } from '@angular/core';
import { UserService } from '../../core/services/user-service/user-api.service';
import { TndmInput } from '../../shared/ui/tndm-input/tndm-input';
import { TndmButton } from '../../shared/ui/tndm-button/tndm-button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ICONS } from '../../shared/constants/icons.constant';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { User } from '../../core/services/user-service/user-api-service.types';
import { TndmAvatar } from '../../shared/components/avatar/tndm-avatar';
import { TndmUserProfileService } from './tndm-user-profile.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { passwordValidator } from '@auth/validators/password-validator';
import { AUTH_ERROR_MESSAGES } from '@auth/constants/auth-error-messages';
import { ProfileUpdates } from './tndm-user-profiles.types';

@Component({
  selector: 'tndm-user-profile',
  imports: [TndmInput, TndmButton, TndmAvatar, ReactiveFormsModule, AngularSvgIconModule],
  templateUrl: './tndm-user-profile.html',
  styleUrl: './tndm-user-profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmUserProfile {
  protected readonly service = inject(TndmUserProfileService);
  private readonly userService = inject(UserService);

  readonly user = this.userService.context;
  readonly ICONS = ICONS;
  protected readonly AUTH_ERROR_MESSAGES = AUTH_ERROR_MESSAGES;

  readonly profileForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl({ value: '', disabled: true }, { nonNullable: true }),
    bio: new FormControl('', { nonNullable: true }),
    password: new FormControl('', { nonNullable: true }),
  });

  constructor() {
    effect(() => {
      const data = this.user();
      if (data && !this.service.isEditMode()) {
        this.fillForm(data);
      }
    });

    this.profileForm
      .get('password')
      ?.valueChanges.pipe(takeUntilDestroyed())
      .subscribe(value => this.updatePasswordValidators(value));
  }

  async handleSubmit(): Promise<void> {
    if (this.profileForm.invalid) return;

    const { username, bio, password } = this.profileForm.getRawValue();
    const updates: ProfileUpdates = {};

    if (this.profileForm.get('username')?.dirty) updates.displayName = username;
    if (this.profileForm.get('bio')?.dirty) updates.bio = bio;
    if (this.profileForm.get('password')?.dirty && password) updates.password = password;

    if (Object.keys(updates).length === 0) {
      return this.service.toggleEditMode();
    }

    const success = await this.service.saveProfile(updates);

    if (success) {
      this.profileForm.get('password')?.reset('', { emitEvent: false });

      this.profileForm.markAsPristine();
      this.profileForm.markAsUntouched();

      this.profileForm.updateValueAndValidity();
    }
  }

  @HostListener('window:keydown.escape')
  protected onEscape(): void {
    this.service.close();
  }

  protected reset(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.fillForm(currentUser);
    }
    this.service.toggleEditMode();
  }

  private fillForm(user: User): void {
    this.profileForm.patchValue({
      username: user.displayName,
      email: user.email,
      bio: user.bio || '',
      password: '',
    });

    const passwordControl = this.profileForm.get('password');
    if (passwordControl) {
      passwordControl.clearValidators();
      passwordControl.markAsPristine();
      passwordControl.markAsUntouched();
      passwordControl.updateValueAndValidity({ emitEvent: false });
    }

    this.profileForm.markAsPristine();
  }

  private updatePasswordValidators(value: string): void {
    const control = this.profileForm.get('password');
    if (!control) return;

    if (value && value.length > 0) {
      control.setValidators([Validators.minLength(8), passwordValidator]);
    } else {
      control.setErrors(null);
      control.clearValidators();
    }

    control.updateValueAndValidity({ emitEvent: false });
  }
}
