import { highlightCode } from './highlight-code';

describe('highlightCode', () => {
  it('should return an array of highlighted lines', () => {
    const result = highlightCode('const x = 1;\nconst y = 2;');
    expect(result.length).toBe(2);
  });

  it('should return one element for single-line code', () => {
    const result = highlightCode('const x = 1;');
    expect(result.length).toBe(1);
  });

  it('should return HTML strings with hljs classes', () => {
    const result = highlightCode('const x = 1;');
    expect(result[0]).toContain('hljs-');
  });

  it('should preserve empty lines', () => {
    const result = highlightCode('const x = 1;\n\nconst y = 2;');
    expect(result.length).toBe(3);
    expect(result[1]).toBe('');
  });

  it('should handle empty string', () => {
    const result = highlightCode('');
    expect(result.length).toBe(1);
  });
});
