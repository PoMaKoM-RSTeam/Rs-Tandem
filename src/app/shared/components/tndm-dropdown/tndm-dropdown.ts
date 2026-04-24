import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, signal } from '@angular/core';
import { DropdownItem } from './tndm-dropdown.types';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'tndm-dropdown',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './tndm-dropdown.html',
  styleUrl: './tndm-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmDropdown {
  private readonly elementRef = inject(ElementRef);
  readonly label = input<string>('');
  readonly items = input<DropdownItem[]>([]);

  readonly isOpen = signal<boolean>(false);

  toggleOpen(): void {
    this.isOpen.set(!this.isOpen());
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }

  closeMenu(): void {
    this.isOpen.set(false);
  }
}
