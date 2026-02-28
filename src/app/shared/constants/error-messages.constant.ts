type ValidationError = {
  requiredLength?: number;
  requirements?: string[];
};

export const DEFAULT_ERROR_MESSAGES: Record<string, (name: string, err?: ValidationError) => string> = {
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
