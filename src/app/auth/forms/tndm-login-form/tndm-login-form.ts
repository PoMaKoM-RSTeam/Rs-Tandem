import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TndmInputComponent } from '../../../shared/ui/tndm-input-component/tndm-input-component';
import { TndmButtonComponent } from '../../../shared/ui/tndm-button-component/tndm-button-component';
import { RouterLink } from '@angular/router';
import { AUTH_ROUTES } from '../../';
import { TndmAuthFormCore } from '../../tndm-auth-form-core/tndm-auth-form-core';
import { FormField } from '../../enums/auth-field-types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-tndm-login-form',
  imports: [ReactiveFormsModule, TndmInputComponent, TndmButtonComponent, RouterLink],
  templateUrl: './tndm-login-form.html',
  styleUrl: './tndm-login-form.scss',
})
export class TndmLoginForm extends TndmAuthFormCore {
  protected readonly toForgotPasswordPath: string = AUTH_ROUTES.FORGOT_PASSWORD;

  constructor() {
    super();
  }

  protected override buildForm(): void {
    this.form.addControl(FormField.email, this.emailControl);
    this.form.addControl(FormField.password, this.passwordControl);
  }

  protected override async handleSubmit(): Promise<void> {
    await this.authService.login(this.emailControl.value, this.passwordControl.value);
  }
}
