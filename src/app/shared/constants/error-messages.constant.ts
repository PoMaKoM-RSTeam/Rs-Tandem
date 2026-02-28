import { ValidationMessages } from '../types/validation.types';

export const DEFAULT_ERROR_MESSAGES: ValidationMessages<{ requiredLength: number }> = {
  required: name => `${name} is required`,
  minlength: (name, err) => `${name} must be at least ${err?.requiredLength} characters`,
  maxlength: (name, err) => `${name} must be maximum ${err?.requiredLength} characters`,
  passwordWeak: (name, err) => {
    const reqs = err?.requirements || [];
    if (reqs.length > 0) {
      return `${name} must contain: ${Array.isArray(reqs) ? reqs.join(', ') : reqs}`;
    }
    return `${name} too weak`;
  },
  loginInvalid: (name, err) => {
    const reqs = err?.requirements || [];
    if (reqs.length > 0) {
      return `${name} must contain: ${Array.isArray(reqs) ? reqs.join(', ') : reqs}`;
    }
    return `${name} invalid format`;
  },
};
