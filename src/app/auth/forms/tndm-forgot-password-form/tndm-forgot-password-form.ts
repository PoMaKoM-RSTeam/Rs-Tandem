import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TndmInput } from '../../../shared/ui/tndm-input/tndm-input';
import { ButtonConfig, TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { TndmAuthFormCore } from '../../tndm-auth-form-core/tndm-auth-form-core';
import { FormField } from '../../enums/auth-field-types';
import { RouterLink } from '@angular/router';
import { translateSignal, TranslocoPipe } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-forgot-password-form',
  imports: [ReactiveFormsModule, TndmInput, TndmButton, RouterLink, TranslocoPipe],
  templateUrl: './tndm-forgot-password-form.html',
  styleUrl: './tndm-forgot-password-form.scss',
})
export class TndmForgotPasswordForm extends TndmAuthFormCore {
  protected readonly resetPasswordLabel = translateSignal('auth.resetPassword');
  protected readonly resetPasswordBtnConfig: Signal<ButtonConfig> = computed<ButtonConfig>(() => ({
    label: this.resetPasswordLabel(),
    isDisabled: !this.canSubmit(),
    type: 'submit',
  }));

  constructor() {
    super();
  }

  protected override buildForm(): void {
    this.form.addControl(FormField.email, this.emailControl);
  }

  protected override async handleSubmit(): Promise<void> {
    await this.authService.sendPasswordResetEmail(this.emailControl.value);
  }
}
