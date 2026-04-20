import { ChangeDetectionStrategy, Component, computed, ElementRef, HostListener, inject, Signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_ROUTES } from '../../constants/app-routes';
import { TndmAuthService } from '@auth';
import { NavigationService } from '../../../core/navigation/navigation.service';
import { TndmLangSwitcher } from '../../../core/i18n/tndm-language-switcher/tndm-language-switcher';
import { ButtonConfig, TndmButton } from '../../ui/tndm-button/tndm-button';
import { NgTemplateOutlet } from '@angular/common';
import { TndmUserProfileService } from '../../../pages/tndm-user-profile/tndm-user-profile.service';
import { TndmAvatar } from '../avatar/tndm-avatar';
import { translateSignal } from '@jsverse/transloco';

@Component({
  selector: 'tndm-header',
  imports: [RouterLink, RouterLinkActive, TndmLangSwitcher, TndmButton, TndmAvatar, NgTemplateOutlet],
  templateUrl: './tndm-header.html',
  styleUrl: './tndm-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmHeader {
  private readonly elementRef = inject(ElementRef);
  readonly authService: TndmAuthService = inject(TndmAuthService);
  readonly navService: NavigationService = inject(NavigationService);
  readonly userProfileService: TndmUserProfileService = inject(TndmUserProfileService);

  private readonly signInLabel: Signal<string> = translateSignal('auth.signIn');
  readonly signInBtnConfig: Signal<ButtonConfig> = computed(() => ({ label: this.signInLabel() }));

  private readonly signUpLabel: Signal<string> = translateSignal('auth.registration');
  readonly signUpBtnConfig: Signal<ButtonConfig> = computed(() => ({
    label: this.signUpLabel(),
    variant: 'secondary',
  }));

  private readonly logoutLabel: Signal<string> = translateSignal('auth.logout');
  readonly logoutBtnConfig: Signal<ButtonConfig> = computed(() => ({
    label: this.logoutLabel(),
    variant: 'secondary',
  }));

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
