import { ValidationMessages } from '../types/validation.types';

export const DEFAULT_ERROR_MESSAGES: ValidationMessages<{ requiredLength: number }> = {
  required: 'validation.required',
  email: 'validation.email',
  minlength: 'validation.minlength',
  maxlength: 'validation.maxlength',
};
