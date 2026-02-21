export const DEFAULT_ERROR_MESSAGES: Record<string, (name: string, err?: Record<string, string>) => string> = {
  required: name => `${name} is required`,
  minlength: (name, err) => `${name} must be at least ${err?.['requiredLength']} characters`,
  maxlength: (name, err) => `${name} must be maximum ${err?.['requiredLength']} characters`,
};
