export type regexName = 'MultiComment' | 'SingleComment' | 'AllWhitespace';

export const REGEX_RULES: Record<regexName, RegExp> = {
  MultiComment: /\/\*[\s\S]*?\*\//g,
  SingleComment: /\/\/.*/g,
  AllWhitespace: /\s+/g,
};
