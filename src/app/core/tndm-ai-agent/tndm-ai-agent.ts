import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TndmAiAgentButton } from './components/tndm-ai-agent-button/tndm-ai-agent-button';
import { TndmAiAgentWrap } from './components/tndm-ai-agent-wrap/tndm-ai-agent-wrap';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-ai-agent',
  imports: [TndmAiAgentButton, TndmAiAgentWrap],
  templateUrl: './tndm-ai-agent.html',
  styleUrl: './tndm-ai-agent.scss',
  standalone: true,
})
export class TndmAiAgent {
  protected readonly isOpen = signal(false);

  toggleAgentWrap(): void {
    this.isOpen.update(value => !value);
  }
}
