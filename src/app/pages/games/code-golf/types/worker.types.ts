export type TestResult = {
  input: unknown;
  output: unknown;
  expected: unknown;
  passed: boolean;
};

export type WorkerResponse = {
  allPassed: boolean;
  results?: TestResult[];
  error?: string;
};

export type WorkerMessage = {
  code: string;
  testCases: TestCase[];
};

export type TestCase = {
  input: unknown;
  expected: unknown;
};
