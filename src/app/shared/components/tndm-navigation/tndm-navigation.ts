import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_ROUTES } from '../../constants/app-routes';

@Component({
  selector: 'tndm-navigation',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tndm-navigation.html',
  styleUrl: './tndm-navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmNavigation {
  readonly navItems = [
    { label: 'code_golf', path: APP_ROUTES.codeGolf },
    { label: 'async_sorter', path: APP_ROUTES.asyncSorter },
    { label: 'type_investigator', path: APP_ROUTES.typeInvestigator },
    { label: 'sandbox', path: APP_ROUTES.sandbox },
    { label: 'event_loop', path: APP_ROUTES.eventLoop },
  ];
}
