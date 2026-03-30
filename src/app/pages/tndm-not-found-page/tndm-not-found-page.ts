import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ButtonConfig, TndmButton } from '../../shared/ui/tndm-button/tndm-button';
import { DotGrid } from '../../shared/components/dot-grid/dot-grid';
import { Router } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-tndm-not-found-page',
  imports: [TndmButton, DotGrid, TranslocoPipe],
  templateUrl: './tndm-not-found-page.html',
  styleUrl: './tndm-not-found-page.scss',
})
export class TndmNotFoundPage {
  private router: Router = inject(Router);
  readonly translocoService = inject(TranslocoService);

  readonly translatedButton = toSignal(this.translocoService.selectTranslate('nfound.mainbtn'));

  protected readonly toMainBtnConfig: Signal<ButtonConfig> = computed(() => ({
    label: this.translatedButton() ?? this.translocoService.translate('nfound.mainbtn'),
    type: 'submit',
  }));

  toMainPage(): void {
    void this.router.navigateByUrl('/');
  }
}
