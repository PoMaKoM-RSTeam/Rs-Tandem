import { Injectable, OnDestroy, signal } from '@angular/core';
import { TestCase } from '../types/challenge';

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

@Injectable({ providedIn: 'root' })
export class CodeValidatorService implements OnDestroy {
  private worker: Worker | undefined;

  readonly isChecking = signal(false);
  readonly lastResult = signal<WorkerResponse | null>(null);

  constructor() {
    this.initWorker();
  }

  private initWorker(): void {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./code-golf.worker', import.meta.url));

      this.worker.onmessage = ({ data }: MessageEvent<WorkerResponse>): void => {
        this.isChecking.set(false);
        this.lastResult.set(data);
      };

      this.worker.onerror = (): void => {
        this.isChecking.set(false);
        this.lastResult.set({ allPassed: false, error: 'Critical Worker Error' });
      };
    }
  }

  check(code: string, testCases: TestCase[]): void {
    if (!this.worker) {
      console.error('Web Worker is not supported');
      return;
    }

    this.isChecking.set(true);
    this.worker.postMessage({ code, testCases });
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
  }
}
