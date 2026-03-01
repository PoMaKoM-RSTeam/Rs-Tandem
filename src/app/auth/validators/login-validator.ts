import { AbstractControl, ValidationErrors } from '@angular/forms';

export function loginValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const trimmedValue = value.trim();

  const failed: string[] = [];

  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedValue)) {
    failed.push('letters, digits, hyphen or underscore only');
  }

  if (/^\d/.test(trimmedValue)) {
    failed.push('cannot start with digit');
  }

  if (failed.length > 0) {
    return { loginInvalid: { requirements: failed } };
  }

  return null;
}
