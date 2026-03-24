import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TndmButton } from '../../../../../shared/ui/tndm-button/tndm-button';
import { WorkerResponse } from '../../types/worker.types';

@Component({
  selector: 'tndm-code-golf-results',
  standalone: true,
  imports: [TndmButton],
  templateUrl: './results-modal.html',
  styleUrl: './results-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeGolfResults {
  readonly result = input.required<WorkerResponse>();
  readonly closeModal = output<void>();

  protected readonly title = computed(() => (this.result().allPassed ? 'Success!' : 'Failed'));

  protected readonly errorText = computed(() => {
    const result = this.result();
    return result.error || 'Some tests failed. Try again!';
  });

  protected readonly okBtnConfig = { label: 'Ok' };

  protected getPassIcon(passed: boolean): string {
    return passed ? '✅' : '❌';
  }
}
