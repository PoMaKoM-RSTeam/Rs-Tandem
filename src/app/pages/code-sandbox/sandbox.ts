import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { ButtonConfig, TndmButton } from '../../shared/ui/tndm-button/tndm-button';
import { SandboxService } from './services/sandbox.service';
import { SandboxFetcherService } from './services/sandbox-fetcher.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tndm-sandbox',
  standalone: true,
  providers: [SandboxService, SandboxFetcherService],
  imports: [FormsModule, MatTabsModule, MonacoEditorModule, TndmButton],
  templateUrl: './sandbox.html',
  styleUrls: ['./sandbox.scss'],
})
export class TndmSandbox {
  private readonly service = inject(SandboxService);

  protected readonly isFullscreen = this.service.isFullscreen.asReadonly();
  protected readonly selectedTab = this.service.selectedTab.asReadonly();
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
    this.service.selectedTab.set(index);
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
    this.service.toggleFullscreen();
  }
}
