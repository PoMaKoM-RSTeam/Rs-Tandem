import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { TndmButton } from '../../ui/tndm-button/tndm-button';
import { TndmNavigation } from '../tndm-header/tndm-header';
import { TndmTitleStrategy } from '../../../core/title-strategy/tndm-title-strategy';
import { TndmLangSwitcher } from '../../../core/i18n/tndm-language-switcher/tndm-language-switcher';

@Component({
  selector: 'tndm-main-layout',
  templateUrl: './tndm-main-layout.html',
  styleUrl: './tndm-main-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, TndmButton, TndmNavigation, TndmLangSwitcher],
})
export class TndmMainLayout {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private titleStrategy = inject(TndmTitleStrategy);

  readonly pageTitle = this.titleStrategy.pageTitle;

  readonly config = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        let route = this.router.routerState.snapshot.root;
        while (route.firstChild) {
          route = route.firstChild;
        }

        return {
          showLines: route.data['showLines'] ?? false,
          headerType: route.data['headerType'] ?? 'default',
        };
      })
    ),
    { initialValue: { showLines: false, headerType: 'default' } }
  );
}
