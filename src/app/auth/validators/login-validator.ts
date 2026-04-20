import { AbstractControl, ValidationErrors } from '@angular/forms';

export function loginValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';

  const failed: string[] = [];

  if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
    failed.push('validation.lettersDigitsHyphenUnderscoreOnly');
  }

  if (/^\d/.test(value)) {
    failed.push('validation.cannotStartWithDigit');
  }

  if (failed.length > 0) {
    return { loginInvalid: { requirements: failed } };
  }

  return null;
}
