import { AbstractControl, ValidationErrors } from '@angular/forms';

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';

  const hasUpper: boolean = /[A-Z]/.test(value);
  const hasLower: boolean = /[a-z]/.test(value);
  const hasDigit: boolean = /\d/.test(value);
  const hasSpecial: boolean = /[!@#$%^&*(),.?":{}|<>]/.test(value);

  const failed: string[] = [];
  if (!hasUpper) {
    failed.push('validation.uppercaseLetter');
  }
  if (!hasLower) {
    failed.push('validation.lowercaseLetter');
  }
  if (!hasDigit) {
    failed.push('validation.digit');
  }
  if (!hasSpecial) {
    failed.push('validation.specialCharacter');
  }

  if (failed.length > 0) {
    return { passwordWeak: { requirements: failed } };
  }

  return null;
}
