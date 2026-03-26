import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingOverlayService } from '../../../core/loading-overlay/loading-overlay-service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tndm-loading-overlay.html',
  styleUrls: ['./tndm-loading-overlay.scss'],
})
export class TndmLoadingOverlay {
  protected readonly loadingService = inject(LoadingOverlayService);
}
