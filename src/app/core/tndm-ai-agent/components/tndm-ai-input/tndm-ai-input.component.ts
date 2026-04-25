import { ChangeDetectionStrategy, Component, computed, inject, Signal, signal } from '@angular/core';
import { ButtonConfig, TndmButton } from '../../../../shared/ui/tndm-button/tndm-button';
import { TndmAiChatService } from '../../services/tndm-ai-chat-service';
import { translateSignal } from '@jsverse/transloco';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-ai-input',
  imports: [TndmButton],
  templateUrl: './tndm-ai-input.component.html',
  styleUrl: './tndm-ai-input.component.scss',
  standalone: true,
})
export class TndmAiInput {
  private readonly chatService = inject(TndmAiChatService);

  protected readonly input = signal('');

  protected readonly placeholder = translateSignal('ai-agent.askYourQuestion');

  protected readonly isSendDisabled = computed(() => this.chatService.assistantTyping() || !this.input().trim());

  protected readonly sendButtonLabel = translateSignal('ai-agent.send')
  protected readonly sendButtonConfig: Signal<ButtonConfig> = computed(
    (): ButtonConfig => ({
      label: this.sendButtonLabel(),
      variant: 'primary',
      isDisabled: this.isSendDisabled(),
    })
  );

  onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.input.set(value);
  }

  onEnter(event: Event): void {
    if (!(event instanceof KeyboardEvent) || event.shiftKey) {
      return;
    }

    event.preventDefault();
    this.send();
  }

  send(): void {
    const value = this.input().trim();

    if (this.isSendDisabled()) {
      return;
    }

    this.chatService.ask(value);
    this.input.set('');
  }
}
