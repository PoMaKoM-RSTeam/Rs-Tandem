import { inject, Injectable, OnDestroy, signal } from '@angular/core';
import { TestCase } from '../types/challenge';
import { CodeGolfFetcherService } from './code-golf-fetcher.service';
import { TndmAuthStateStoreService } from '@auth';

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
export class CodeGolfService implements OnDestroy {
  private readonly fetcher = inject(CodeGolfFetcherService);
  private readonly authStore = inject(TndmAuthStateStoreService);
  private worker: Worker | undefined;

  readonly result = signal<WorkerResponse | null>(null);

  constructor() {
    this.initWorker();
  }

  private initWorker(): void {
    if (typeof Worker !== 'undefined') {
      this.worker = new Worker(new URL('./code-golf.worker', import.meta.url));

      this.worker.onmessage = ({ data }: MessageEvent<WorkerResponse>): void => {
        this.result.set(data);
      };

      this.worker.onerror = (): void => {
        this.result.set({ allPassed: false, error: 'Critical Worker Error' });
      };
    }
  }

  check(code: string, testCases: TestCase[]): void {
    if (!this.worker) {
      console.error('Web Worker is not supported');
      return;
    }
    this.worker.postMessage({ code, testCases });
  }

  ngOnDestroy(): void {
    this.worker?.terminate();
  }
}
