import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TndmInputComponent } from '../../../shared/ui/tndm-input-component/tndm-input-component';
import { TndmButtonComponent } from '../../../shared/ui/tndm-button-component/tndm-button-component';
import { TndmAuthFormCore } from '../../tndm-auth-form-core/tndm-auth-form-core';
import { FormField } from '../../enums/auth-field-types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-tndm-forgot-password-form',
  imports: [ReactiveFormsModule, TndmInputComponent, TndmButtonComponent],
  templateUrl: './tndm-forgot-password-form.html',
  styleUrl: './tndm-forgot-password-form.scss',
})
export class TndmForgotPasswordForm extends TndmAuthFormCore {
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
