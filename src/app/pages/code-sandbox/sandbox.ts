import { ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonConfig, TndmButton } from '../../shared/ui/tndm-button/tndm-button';
import { SabdboxService } from './services/sandbox.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-sandbox',
  standalone: true,
  imports: [FormsModule, MatTabsModule, MonacoEditorModule, TndmButton, TranslocoPipe],
  templateUrl: './sandbox.html',
  styleUrls: ['./sandbox.scss'],
})
export class TndmSandbox {
  protected readonly service = inject(SabdboxService)

  protected readonly fullscreenBtnConfig = computed<ButtonConfig>(() => ({
    variant: 'icon',
    icon: this.service.isFullscreen() ? 'fullscreenExit' : 'fullscreen',
    size: 'lg',
  }));

  protected readonly downloadBtnConfig: ButtonConfig = {
    variant: 'icon',
    icon: 'download',
    size: 'lg',
  };

  protected readonly uploadBtnConfig: ButtonConfig = {
    variant: 'icon',
    icon: 'upload',
    size: 'lg',
  };

  protected toggleFullscreen(): void {
    this.service.isFullscreen.update(v => !v);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }

  protected save(): void {}
  protected download(): void {}
}
