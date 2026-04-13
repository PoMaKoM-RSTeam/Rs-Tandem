import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { TndmButton } from '../../../../../shared/ui/tndm-button/tndm-button';
import { WorkerResponse } from '../../types/worker.types';
import { translateSignal, TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'tndm-code-golf-results',
  standalone: true,
  imports: [TndmButton, TranslocoPipe],
  templateUrl: './results-modal.html',
  styleUrl: './results-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmCodeGolfResults {
  readonly result = input.required<WorkerResponse>();
  readonly closeModal = output<void>();
  private readonly successMsg = translateSignal('golf.success');

  protected readonly errorText = computed(() => {
    const result = this.result();
    return result.error || 'Some tests failed. Try again!';
  });

  protected readonly okBtnConfig = { label: 'Ok' };

  protected getPassIcon(passed: boolean): string {
    return passed ? '✅' : '❌';
  }
}
