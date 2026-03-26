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

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-dot',
  imports: [],
  templateUrl: './tndm-dot.component.html',
  styleUrl: './tndm-dot.component.scss',
})
export class TndmDot {
  private el: ElementRef = inject(ElementRef);
  private renderer: Renderer2 = inject(Renderer2);

  readonly x: InputSignal<number> = input.required<number>();
  readonly y: InputSignal<number> = input.required<number>();

  private readonly transform: Signal<string> = computed((): string => `translate(${this.x()}px, ${this.y()}px)`);

  constructor() {
    effect((): void => this.renderer.setStyle(this.el.nativeElement, 'transform', this.transform()));
  }
}
