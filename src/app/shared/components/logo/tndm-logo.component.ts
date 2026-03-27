import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  InputSignal,
  Renderer2,
  Signal,
} from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-logo',
  imports: [SvgIconComponent],
  templateUrl: './tndm-logo.component.html',
  styleUrl: './tndm-logo.component.scss',
})
export class TndmLogo {
  protected readonly logoSvgPath: string = 'svgs/union.svg';
  private readonly width: number = 168;
  private readonly height: number = 188;

  private readonly el: ElementRef<HTMLElement> = inject(ElementRef<HTMLElement>);
  private readonly renderer: Renderer2 = inject(Renderer2);

  readonly x: InputSignal<number> = input.required<number>();
  readonly y: InputSignal<number> = input.required<number>();

  private readonly transform: Signal<string> = computed((): string => {
    const left: number = this.x() - this.width / 2;
    const top: number = this.y() - this.height / 2;
    return `translate(${left}px, ${top}px)`;
  });

  constructor() {
    effect((): void => this.renderer.setStyle(this.el.nativeElement, 'transform', this.transform()));
  }
}
