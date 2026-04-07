import { AuthError } from '@supabase/supabase-js';
import { AUTH_ERROR_KEYS } from '../enums/auth-error-key';

export const handleSupabaseAuthError = (error: AuthError): string => {
  const message = error.message.toLowerCase();

  if (message.includes(AUTH_ERROR_KEYS.InvalidCredentials)) {
    return 'auth.invalidCredentials';
  }

  if (message.includes(AUTH_ERROR_KEYS.UserAlreadyExists)) {
    return 'auth.userAlreadyExists';
  }

  if (message.includes(AUTH_ERROR_KEYS.EmailNotConfirmed)) {
    return 'auth.emailNotConfirmed';
  }

  if (message.includes(AUTH_ERROR_KEYS.WeakPassword)) {
    return 'auth.weakPassword';
  }

  return error.message;
};
