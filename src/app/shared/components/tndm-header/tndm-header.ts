import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_ROUTES } from '../../constants/app-routes';
import { TndmAuthService } from '@auth';
import { NavigationService } from '../../../core/navigation/navigation.service';
import { TndmLangSwitcher } from '../../../core/i18n/tndm-language-switcher/tndm-language-switcher';
import { TndmButton } from '../../ui/tndm-button/tndm-button';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'tndm-header',
  imports: [RouterLink, RouterLinkActive, TndmLangSwitcher, TndmButton, NgTemplateOutlet],
  templateUrl: './tndm-header.html',
  styleUrl: './tndm-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmNavigation {
  private readonly elementRef = inject(ElementRef);
  readonly authService: TndmAuthService = inject(TndmAuthService);
  readonly navService: NavigationService = inject(NavigationService);

  readonly signInBtnConfig = { label: 'sign in' } as const;
  readonly signUpBtnConfig = {
    label: 'sign up',
    variant: 'secondary',
  } as const;
  readonly logoutBtnConfig = {
    label: 'logout',
    variant: 'secondary',
  } as const;

  readonly navItems = [
    { label: 'code_golf', path: APP_ROUTES.codeGolf },
    { label: 'async_sorter', path: APP_ROUTES.asyncSorter },
    { label: 'ai_exam', path: APP_ROUTES.aiExam },
    { label: 'sandbox', path: APP_ROUTES.sandbox },
    { label: 'type_investigator', path: APP_ROUTES.typeInvestigator },
    { label: 'code_review', path: APP_ROUTES.reverseCodeReview },
    { label: 'dashboard', path: APP_ROUTES.dashboard },
  ];
  isMenuOpen = false;

  toggleMenu(event?: Event): void {
    event?.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target) && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  onSignInClick(): void {
    this.navService.goToLogin();
  }

  onSignUpClick(): void {
    this.navService.goToRegister();
  }

  onLogoutClick(): void {
    this.navService.logout();
  }
}
