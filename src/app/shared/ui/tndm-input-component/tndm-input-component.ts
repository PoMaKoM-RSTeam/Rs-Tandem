import { ChangeDetectionStrategy, Component, DestroyRef, inject, input } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, ReactiveFormsModule } from '@angular/forms';
import { DEFAULT_ERROR_MESSAGES } from '../../constants/error-messages.constant';
import { ICONS } from '../../constants/icons.constant';
import { SvgIconComponent } from 'angular-svg-icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const typeInput = {
  email: 'email',
  password: 'password',
  search: 'search',
  tel: 'tel',
  text: 'text',
  url: 'url',
} as const;

export type InputType = keyof typeof typeInput;

@Component({
  selector: 'tndm-input-component',
  imports: [ReactiveFormsModule, SvgIconComponent],
  templateUrl: './tndm-input-component.html',
  styleUrl: './tndm-input-component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TndmInputComponent implements ControlValueAccessor {
  private readonly controlDir = inject(NgControl, { self: true, optional: true });
  private readonly destroyRef = inject(DestroyRef);
  readonly control = new FormControl('');

  readonly id = input.required<string>();
  readonly name = input.required<string>();

  readonly label = input<string | null>(null);
  readonly type = input<InputType>('text');
  readonly placeholder = input<string | null>(null);
  readonly errorMessages = input<Record<string, string>>({});

  readonly icon = input<keyof typeof ICONS | null>(null);
  readonly ICONS = ICONS;

  onChange: (val: string | null) => void = () => {};
  onTouched: () => void = () => {};

  constructor() {
    this.control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => this.onChange(value));
    if (this.controlDir) {
      this.controlDir.valueAccessor = this;
    }
  }

  writeValue(value: string | null): void {
    this.control.setValue(value ?? '', { emitEvent: false });
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.control.disable();
    } else {
      this.control.enable();
    }
  }

  isError(): boolean {
    const control = this.controlDir?.control;
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  textError(): string | null {
    const control = this.controlDir?.control;

    if (!control || !control.errors) {
      return null;
    }

    const errorKeys = Object.keys(control.errors);
    if (errorKeys.length === 0) {
      return null;
    }

    const errorName = errorKeys[0];
    const customMessage = this.errorMessages()[errorName];

    if (customMessage) {
      return customMessage.toLowerCase();
    }

    const defaultMsg = DEFAULT_ERROR_MESSAGES[errorName];

    return defaultMsg ? defaultMsg(this.name(), control.errors[errorName]).toLowerCase() : 'invalid value';
  }
}
