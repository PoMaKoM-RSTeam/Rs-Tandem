import { ChangeDetectionStrategy, Component, computed, Signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TndmInput } from '../../../shared/ui/tndm-input/tndm-input';
import { ButtonConfig, TndmButton } from '../../../shared/ui/tndm-button/tndm-button';
import { RouterLink } from '@angular/router';
import { TndmAuthFormCore } from '../../tndm-auth-form-core/tndm-auth-form-core';
import { FormField } from '../../enums/auth-field-types';
import { translateSignal, TranslocoPipe } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-register-form',
  imports: [TndmButton, TndmInput, ReactiveFormsModule, RouterLink, TranslocoPipe],
  templateUrl: './tndm-register-form.html',
  styleUrl: './tndm-register-form.scss',
})
export class TndmRegisterForm extends TndmAuthFormCore {
  protected readonly signUpLabel = translateSignal('auth.signUp');

  protected readonly signUpBtnConfig: Signal<ButtonConfig> = computed(() => ({
    label: this.signUpLabel(),
    type: 'submit',
    isDisabled: !this.canSubmit(),
  }));

  protected readonly signUpWithGoogleLabel = translateSignal('auth.signUpGoogle');

  protected readonly signWithGoogleBtnConfig: Signal<ButtonConfig> = computed(() => ({
    icon: 'google',
    variant: 'black',
    label: this.signUpWithGoogleLabel(),
    isDisabled: this.isLoading(),
  }));

  protected readonly signUpWithGithubLabel = translateSignal('auth.signUpGithub');

  protected readonly signWithGithubBtnConfig: Signal<ButtonConfig> = computed(() => ({
    icon: 'github',
    variant: 'black',
    label: this.signUpWithGithubLabel(),
    isDisabled: this.isLoading(),
  }));

  constructor() {
    super();
  }

  protected override buildForm(): void {
    this.form.addControl(FormField.login, this.loginControl);
    this.form.addControl(FormField.email, this.emailControl);
    this.form.addControl(FormField.password, this.passwordControl);
  }

  protected override async handleSubmit(): Promise<void> {
    const login: string = this.loginControl.value;
    const email: string = this.emailControl.value;
    const password: string = this.passwordControl.value;

    await this.authService.register(login, email, password);

    await this.navigateToMain();
  }
}
