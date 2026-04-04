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
    { label: 'ai_exam', path: APP_ROUTES.aiExam },
    { label: 'sandbox', path: APP_ROUTES.sandbox },
    { label: 'type_investigator', path: APP_ROUTES.typeInvestigator },
    { label: 'code_review', path: APP_ROUTES.reverseCodeReview },
    { label: 'dashboard', path: APP_ROUTES.dashboard },
  ];
}
