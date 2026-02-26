import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TndmButtonComponent } from '../../../shared/ui/tndm-button-component/tndm-button-component';
import { TndmInputComponent } from '../../../shared/ui/tndm-input-component/tndm-input-component';
import { TndmAuthFormCore } from '../../tndm-auth-form-core/tndm-auth-form-core';
import { FormField } from '../../enums/auth-field-types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-tndm-update-password',
  imports: [FormsModule, TndmButtonComponent, TndmInputComponent, ReactiveFormsModule],
  templateUrl: './tndm-update-password.html',
  styleUrl: './tndm-update-password.scss',
})
export class TndmUpdatePassword extends TndmAuthFormCore {
  constructor() {
    super();
  }

  protected override buildForm(): void {
    this.form.addControl(FormField.password, this.passwordControl);
  }
  protected override async handleSubmit(): Promise<void> {
    await this.authService.updatePassword(this.passwordControl.value);
  }
}
