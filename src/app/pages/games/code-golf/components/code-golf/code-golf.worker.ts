/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  const { code, testCases } = data;
  const results = [];

  const userFn = createSafeFunction(code);
  try {
    for (const test of testCases) {
      const output = userFn(...test);
      const passed = JSON.stringify(output) === JSON.stringify(test.expected);
      results.push({ input: test, output, passed });
    }

    postMessage({ success: true, results });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown execution error';
    postMessage({ success: false, errorMessage });
  }
});

function createSafeFunction(userCode: string): (...args: unknown[]) => unknown {
  const wrappedCode = `
    "use strict";
    const self = undefined;
    const fetch = undefined;
    return (${userCode});
  `;

  const userFn = new Function(wrappedCode)();

  if (typeof userFn !== 'function') {
    throw new Error('Submitted code is not a valid function.');
  }
  return userFn;
}
