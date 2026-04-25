import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Signal,
  viewChild,
} from '@angular/core';
import { TndmAiChatService } from '../../services/tndm-ai-chat-service';
import { TndmAiChatMessage } from '../tndm-ai-chat-message/tndm-ai-chat-message';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonConfig, TndmButton } from '../../../../shared/ui/tndm-button/tndm-button';
import { translateSignal, TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'tndm-ai-chat',
  standalone: true,
  templateUrl: './tndm-ai-chat.html',
  styleUrl: './tndm-ai-chat.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TndmAiChatMessage, SvgIconComponent, TndmButton, TranslocoPipe],
})
export class TndmAiChat {
  private readonly chatService = inject(TndmAiChatService);

  protected readonly messages = this.chatService.messages;
  protected readonly assistantTyping = this.chatService.assistantTyping;
  protected readonly currentAssistantId = this.chatService.currentAssistantId;

  protected readonly clearBtnLabel = translateSignal('ai-agent.clear');
  protected readonly clearBtnConfig: Signal<ButtonConfig> = computed(() => ({
    variant: 'black',
    icon: 'clear',
    label: this.clearBtnLabel(),
    isDisabled: this.chatService.assistantTyping(),
  }));

  private readonly scrollContainer = viewChild<ElementRef<HTMLDivElement>>('scrollContainer');

  constructor() {
    effect(() => {
      this.messages();

      queueMicrotask(() => {
        const elRef = this.scrollContainer();
        if (!elRef) return;

        const el = elRef.nativeElement;
        el.scrollTop = el.scrollHeight;
      });
    });
  }

  clearMessages(): void {
    this.chatService.clearMessages();
  }
}
