import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TndmToaster } from './shared/ui/tndm-toaster/tndm-toaster';
import { TndmLoadingOverlay } from './shared/ui/tndm-loading-overlay/tndm-loading-overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TndmToaster, TndmLoadingOverlay],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('my-temp-app');
}
