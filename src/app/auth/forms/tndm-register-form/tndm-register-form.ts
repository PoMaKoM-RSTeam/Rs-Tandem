import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TndmInputComponent } from '../../../shared/ui/tndm-input-component/tndm-input-component';
import { TndmButtonComponent } from '../../../shared/ui/tndm-button-component/tndm-button-component';
import { AUTH_ROUTES } from '../../';
import { RouterLink } from '@angular/router';
import { TndmAuthFormCore } from '../../tndm-auth-form-core/tndm-auth-form-core';
import { FormField } from '../../enums/auth-field-types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-tndm-register-form',
  imports: [FormsModule, TndmButtonComponent, TndmInputComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './tndm-register-form.html',
  styleUrl: './tndm-register-form.scss',
})
export class TndmRegisterForm extends TndmAuthFormCore {
  protected readonly toForgotPasswordPath: string = AUTH_ROUTES.FORGOT_PASSWORD;

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
  }
}
