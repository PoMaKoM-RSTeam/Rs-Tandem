import { ChangeDetectionStrategy, Component, computed, inject, Signal } from '@angular/core';
import { ButtonConfig, TndmButton } from '../../shared/ui/tndm-button/tndm-button';
import { DotGrid } from '../../shared/components/dot-grid/dot-grid';
import { Router } from '@angular/router';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-tndm-not-found-page',
  imports: [TndmButton, DotGrid],
  templateUrl: './tndm-not-found-page.html',
  styleUrl: './tndm-not-found-page.scss',
})
export class TndmNotFoundPage {
  private router: Router = inject(Router);

  protected readonly toMainBtnConfig: Signal<ButtonConfig> = computed(() => ({
    label: 'go to the main page',
    type: 'submit',
  }));

  toMainPage(): void {
    void this.router.navigateByUrl('/');
  }
}
