import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ICONS } from '../../constants/icons.constant';

@Component({
  selector: 'tndm-button-component',
  imports: [AngularSvgIconModule],
  templateUrl: './tndm-button-component.html',
  styleUrl: './tndm-button-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmButtonComponent {
  readonly btnConfig = input.required<ButtonConfig>();
  readonly clicked = output<MouseEvent>();
  private defaultConfig: ButtonCommon = {
    variant: 'primary',
    size: 'md',
    isDisabled: false,
    type: 'button',
  };
  readonly ICONS = ICONS;

  readonly config = computed(() => ({
    ...this.defaultConfig,
    ...this.btnConfig(),
  }));

  readonly buttonClass = computed(() => {
    const { variant, size, place } = this.config();
    return `button_variant_${variant} button_size_${size}${place ? ' button_place_' + place : ''}`;
  });

  readonly isDisabled = computed(() => this.config().isDisabled ?? false);

  readonly formattedLabel = computed(() => {
    const label = this.config().label;
    if (!label) {
      return null;
    }
    return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  });

  onClick(event: MouseEvent): void {
    if (!this.isDisabled()) {
      this.clicked.emit(event);
    }
  }
}

export type ButtonConfig = ButtonCommon & (ButtonWithText | ButtonWithIcon);

type ButtonCommon = {
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md';
  place?: string;
  isDisabled?: boolean;
  type?: 'button' | 'submit';
};

type ButtonWithText = {
  label: string;
  icon?: keyof typeof ICONS;
};

type ButtonWithIcon = {
  label?: string;
  icon: keyof typeof ICONS;
};
