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
  readonly appRoutes = APP_ROUTES;
}
