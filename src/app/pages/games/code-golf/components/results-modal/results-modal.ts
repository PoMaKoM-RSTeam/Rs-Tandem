import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TndmButton } from '../../../../../shared/ui/tndm-button/tndm-button';
import { WorkerResponse } from '../../services/code-validator.service';

@Component({
  selector: 'tndm-results-modal',
  standalone: true,
  imports: [TndmButton],
  templateUrl: './results-modal.html',
  styleUrl: './results-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmResultsModal {
  readonly result = input.required<WorkerResponse>();
  readonly closeModal = output<void>();

  protected readonly okBtnConfig = { label: 'Ok' };
}
