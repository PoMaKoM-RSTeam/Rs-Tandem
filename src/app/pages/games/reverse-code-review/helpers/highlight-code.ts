import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';

hljs.registerLanguage('typescript', typescript);

export function highlightCode(code: string): string[] {
  const result = hljs.highlight(code, { language: 'typescript' });
  return result.value.split('\n');
}
