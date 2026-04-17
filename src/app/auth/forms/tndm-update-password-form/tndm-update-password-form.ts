import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonConfig, TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { TndmInput } from '../../../shared/ui/tndm-input/tndm-input';
import { TndmAuthFormCore } from '../../tndm-auth-form-core/tndm-auth-form-core';
import { FormField } from '../../enums/auth-field-types';
import { AUTH_ROUTES } from '@auth';
import { RouterLink } from '@angular/router';
import { translateSignal, TranslocoPipe } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-update-password-form',
  imports: [TndmButton, TndmInput, ReactiveFormsModule, RouterLink, TranslocoPipe],
  templateUrl: './tndm-update-password-form.html',
  styleUrl: './tndm-update-password-form.scss',
})
export class TndmUpdatePasswordForm extends TndmAuthFormCore {
  protected readonly updatePasswordLabel = translateSignal('auth.updatePassword');

  protected readonly updatePasswordBtnConfig: Signal<ButtonConfig> = computed(() => ({
    variant: 'secondary',
    label: this.updatePasswordLabel(),
    isDisabled: !this.canSubmit(),
    type: 'submit',
  }));

  constructor() {
    super();
  }

  protected override buildForm(): void {
    this.form.addControl(FormField.password, this.passwordControl);
  }
  protected override async handleSubmit(): Promise<void> {
    await this.authService.updatePassword(this.passwordControl.value);

    await this.authService.logout();
    this.toastService.info(
      this.transloco.translate('auth.updated'),
      this.transloco.translate('auth.loginWithNewPassword')
    );
    await this.router.navigateByUrl(AUTH_ROUTES.LOGIN);
  }
}
