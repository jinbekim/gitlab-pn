import { getClickUpTaskUrl } from "@domain/clickup";
import type { IframeContainer } from "./types";

const SIDE_PANEL_CLASS = "clickup-side-panel";
const SIDE_PANEL_HEADER_CLASS = "clickup-side-panel-header";
const SIDE_PANEL_IFRAME_CLASS = "clickup-side-panel-iframe";
const SIDE_PANEL_LOADING_CLASS = "clickup-side-panel-loading";

/**
 * Side panel component for displaying ClickUp tasks alongside MR content
 */
export class SidePanel implements IframeContainer {
  private panel: HTMLDivElement | null = null;
  private currentTaskId: string | null = null;

  getIframeSrc(taskId: string): string {
    return getClickUpTaskUrl(taskId);
  }

  isVisible(): boolean {
    return this.panel !== null && this.panel.classList.contains("visible");
  }

  getCurrentTaskId(): string | null {
    return this.currentTaskId;
  }

  show(taskId: string): void {
    this.currentTaskId = taskId;

    // Create panel if not exists
    if (!this.panel) {
      this.createPanel();
    }

    // Update iframe src
    const iframe = this.panel?.querySelector<HTMLIFrameElement>(
      `.${SIDE_PANEL_IFRAME_CLASS}`
    );
    const loading = this.panel?.querySelector<HTMLDivElement>(
      `.${SIDE_PANEL_LOADING_CLASS}`
    );

    if (iframe) {
      // Show loading state
      if (loading) {
        loading.style.display = "flex";
      }
      iframe.style.display = "none";

      iframe.src = this.getIframeSrc(taskId);
      iframe.onload = () => {
        if (loading) {
          loading.style.display = "none";
        }
        iframe.style.display = "block";
      };
      iframe.onerror = () => {
        if (loading) {
          loading.textContent = "로드 실패";
        }
      };
    }

    // Show panel
    if (this.panel) {
      this.panel.classList.add("visible");
    }

    // Adjust main content width
    this.adjustMainContent(true);
  }

  hide(): void {
    if (this.panel) {
      this.panel.classList.remove("visible");

      // Clear iframe to stop loading
      const iframe = this.panel.querySelector<HTMLIFrameElement>(
        `.${SIDE_PANEL_IFRAME_CLASS}`
      );
      if (iframe) {
        iframe.src = "about:blank";
      }
    }

    this.currentTaskId = null;

    // Restore main content width
    this.adjustMainContent(false);
  }

  destroy(): void {
    this.hide();
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  }

  private createPanel(): void {
    this.panel = document.createElement("div");
    this.panel.className = SIDE_PANEL_CLASS;

    // Create header
    const header = document.createElement("div");
    header.className = SIDE_PANEL_HEADER_CLASS;

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "clickup-side-panel-close";
    closeBtn.innerHTML = "✕";
    closeBtn.title = "닫기";
    closeBtn.onclick = () => this.hide();

    // Title
    const title = document.createElement("span");
    title.className = "clickup-side-panel-title";
    title.textContent = "ClickUp";

    // Open in new tab button
    const newTabBtn = document.createElement("button");
    newTabBtn.className = "clickup-side-panel-btn";
    newTabBtn.innerHTML = "🔗";
    newTabBtn.title = "새 탭에서 열기";
    newTabBtn.onclick = () => {
      if (this.currentTaskId) {
        window.open(this.getIframeSrc(this.currentTaskId), "_blank");
      }
    };

    header.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(newTabBtn);

    // Create loading indicator
    const loading = document.createElement("div");
    loading.className = SIDE_PANEL_LOADING_CLASS;
    loading.textContent = "로딩 중...";

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.className = SIDE_PANEL_IFRAME_CLASS;
    iframe.setAttribute("allow", "clipboard-read; clipboard-write");
    iframe.style.display = "none";

    // Assemble panel
    this.panel.appendChild(header);
    this.panel.appendChild(loading);
    this.panel.appendChild(iframe);

    document.body.appendChild(this.panel);
  }

  /**
   * Adjust main content to make room for side panel
   */
  private adjustMainContent(showPanel: boolean): void {
    const mainContent = document.querySelector<HTMLElement>(
      ".content-wrapper, .layout-page, main"
    );
    if (mainContent) {
      if (showPanel) {
        mainContent.style.marginRight = "400px";
        mainContent.style.transition = "margin-right 0.3s ease";
      } else {
        mainContent.style.marginRight = "";
      }
    }
  }
}

/**
 * Singleton instance for easy access
 */
let sidePanelInstance: SidePanel | null = null;

export function getSidePanel(): SidePanel {
  if (!sidePanelInstance) {
    sidePanelInstance = new SidePanel();
  }
  return sidePanelInstance;
}

export function showSidePanel(taskId: string): void {
  getSidePanel().show(taskId);
}

export function hideSidePanel(): void {
  getSidePanel().hide();
}

export function pinToSidePanel(taskId: string): void {
  getSidePanel().show(taskId);
}

export function destroySidePanel(): void {
  if (sidePanelInstance) {
    sidePanelInstance.destroy();
    sidePanelInstance = null;
  }
}
