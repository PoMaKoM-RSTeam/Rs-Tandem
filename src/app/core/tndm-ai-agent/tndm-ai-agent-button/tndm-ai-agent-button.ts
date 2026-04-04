import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-ai-agent-button',
  templateUrl: './tndm-ai-agent-button.html',
  styleUrl: './tndm-ai-agent-button.scss',
  standalone: true,
})
export class TndmAiAgentButton {
  readonly isOpen = input<boolean>(false);
}
