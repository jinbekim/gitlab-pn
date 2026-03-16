/**
 * MR Description Viewer Plugin
 * Shows MR description in a side panel on non-overview tabs
 */

import { BasePlugin, type PluginMeta } from '@core/plugin';
import { createObserver, disconnectObserver } from '@utils/observer';
import { parseMrUrl, isOnOverviewTab, type MrUrlInfo } from './url';
import { fetchMrDescription, clearCache } from './api';
import { createToggleButton } from './ui/ToggleButton';
import {
  createDescDialog,
  openDialog,
  closeDialog,
  setDialogContent,
  setDialogLoading,
  setDialogError,
} from './ui/DescDialog';

const OBSERVER_ID = 'mr-desc-viewer-title-observer';

export class MrDescViewerPlugin extends BasePlugin {
  readonly meta: PluginMeta = {
    id: 'mr-desc-viewer',
    name: 'MR Description Viewer',
    version: '1.0.0',
    enabledKey: 'mr-desc-viewer-enabled',
  };

  private toggleButton: HTMLButtonElement | null = null;
  private dialog: HTMLDialogElement | null = null;
  private currentMrInfo: MrUrlInfo | null = null;
  private lastUrl = '';
  private popstateHandler: (() => void) | null = null;
  private navEventHandler: (() => void) | null = null;

  override async start(): Promise<void> {
    if (this._state === 'active') return;

    this.handleUrlChange();
    this.setupNavigationListeners();

    await super.start();
  }

  override stop(): void {
    if (this._state !== 'active') return;

    disconnectObserver(OBSERVER_ID);

    if (this.popstateHandler) {
      window.removeEventListener('popstate', this.popstateHandler);
      this.popstateHandler = null;
    }
    if (this.navEventHandler) {
      window.removeEventListener('__mr_desc_nav__', this.navEventHandler);
      this.navEventHandler = null;
    }
    this.removeUI();
    this.lastUrl = '';
    this.currentMrInfo = null;

    super.stop();
  }

  private setupNavigationListeners(): void {
    const onNav = () => this.handleUrlChange();

    // Watch <title> changes for SPA navigation
    const titleEl = document.querySelector('title');
    if (titleEl) {
      createObserver({
        id: OBSERVER_ID,
        target: titleEl,
        callback: onNav,
        config: { childList: true },
      });
    }

    // popstate for back/forward navigation
    this.popstateHandler = onNav;
    window.addEventListener('popstate', this.popstateHandler);

    // Listen for custom nav event from MAIN world nav-interceptor script
    this.navEventHandler = onNav;
    window.addEventListener('__mr_desc_nav__', this.navEventHandler);
  }

  private handleUrlChange(): void {
    const currentUrl = location.pathname;
    if (currentUrl === this.lastUrl) return;
    this.lastUrl = currentUrl;

    const mrInfo = parseMrUrl();

    if (!mrInfo || isOnOverviewTab(mrInfo)) {
      this.removeUI();
      return;
    }

    // Different MR → close dialog, clear cache
    const prevMr = this.currentMrInfo;
    if (prevMr && (prevMr.projectPath !== mrInfo.projectPath || prevMr.mrIid !== mrInfo.mrIid)) {
      if (this.dialog?.open) {
        closeDialog(this.dialog);
        this.toggleButton?.classList.remove('active');
      }
      clearCache();
    }

    this.currentMrInfo = mrInfo;
    this.ensureUI();
  }

  private ensureUI(): void {
    if (!this.dialog) {
      this.dialog = createDescDialog();
      this.dialog.addEventListener('close', () => {
        this.toggleButton?.classList.remove('active');
      });
      // Click on backdrop (the dialog element itself, outside inner content) closes
      this.dialog.addEventListener('click', (e) => {
        if (e.target === this.dialog) {
          closeDialog(this.dialog!);
        }
      });
      document.body.appendChild(this.dialog);
    }

    if (!this.toggleButton) {
      this.toggleButton = createToggleButton(() => this.toggleDialog());
      document.body.appendChild(this.toggleButton);
    }
  }

  private removeUI(): void {
    if (this.dialog) {
      if (this.dialog.open) closeDialog(this.dialog);
      this.dialog.remove();
      this.dialog = null;
    }
    if (this.toggleButton) {
      this.toggleButton.remove();
      this.toggleButton = null;
    }
  }

  private async toggleDialog(): Promise<void> {
    if (!this.dialog || !this.toggleButton || !this.currentMrInfo) return;

    if (this.dialog.open) {
      closeDialog(this.dialog);
      this.toggleButton.classList.remove('active');
      return;
    }

    openDialog(this.dialog);
    this.toggleButton.classList.add('active');
    setDialogLoading(this.dialog);

    const { projectPath, mrIid } = this.currentMrInfo;

    try {
      const data = await fetchMrDescription(projectPath, mrIid);
      if (this.dialog?.open) {
        setDialogContent(this.dialog, data.descriptionHtml);
      }
    } catch (err) {
      if (this.dialog?.open) {
        setDialogError(
          this.dialog,
          err instanceof Error ? err.message : 'Failed to load description',
        );
      }
    }
  }
}
