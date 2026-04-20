import { ValidationMessages } from '../../shared/types/validation.types';

export const AUTH_ERROR_MESSAGES: ValidationMessages<{ requirements: string[] }> = {
  passwordWeak: 'validation.passwordWeak',
  loginInvalid: 'validation.loginInvalid',
} as const;

export type AuthErrorKey = keyof typeof AUTH_ERROR_MESSAGES;
