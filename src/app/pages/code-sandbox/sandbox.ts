import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonConfig, TndmButton } from '../../shared/ui/tndm-button/tndm-button';
import { SandboxService } from './services/sandbox.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-sandbox',
  standalone: true,
  imports: [FormsModule, MatTabsModule, MonacoEditorModule, TndmButton, TranslocoPipe],
  templateUrl: './sandbox.html',
  styleUrls: ['./sandbox.scss'],
})
export class TndmSandbox {
  private readonly service = inject(SandboxService);

  protected readonly isFullscreen = this.service.isFullscreen;
  protected readonly selectedTab = this.service.selectedTab;
  protected readonly tabs = this.service.tabs;
  protected readonly activeCode = this.service.activeCode;
  protected readonly activeEditorOptions = this.service.activeEditorOptions;
  protected readonly previewContent = this.service.previewContent;

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

  protected readonly saveBtnConfig: ButtonConfig = {
    variant: 'icon',
    icon: 'save',
    size: 'lg',
  };

  protected onTabChange(index: number): void {
    this.selectedTab.set(index);
  }

  protected updateCode(value: string): void {
    this.service.updateActiveCode(value);
  }

  protected save(): void {
    this.service.save();
  }

  protected download(): void {
    this.service.download();
  }

  protected toggleFullscreen(): void {
    this.service.isFullscreen.update(v => !v);
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 100);
  }
}
