import { getClickUpTaskUrl } from "@domain/clickup";
import type { IframeContainer } from "./types";

const MODAL_OVERLAY_CLASS = "clickup-modal-overlay";
const MODAL_CLASS = "clickup-modal";
const MODAL_HEADER_CLASS = "clickup-modal-header";
const MODAL_IFRAME_CLASS = "clickup-modal-iframe";
const MODAL_LOADING_CLASS = "clickup-modal-loading";

/**
 * Modal component for displaying ClickUp tasks in an iframe
 */
export class Modal implements IframeContainer {
  private overlay: HTMLDivElement | null = null;
  private currentTaskId: string | null = null;
  private onPinToSidePanel: ((taskId: string) => void) | null = null;

  constructor(onPinToSidePanel?: (taskId: string) => void) {
    this.onPinToSidePanel = onPinToSidePanel || null;
  }

  getIframeSrc(taskId: string): string {
    return getClickUpTaskUrl(taskId);
  }

  isVisible(): boolean {
    return this.overlay !== null && this.overlay.style.display !== "none";
  }

  getCurrentTaskId(): string | null {
    return this.currentTaskId;
  }

  show(taskId: string): void {
    this.currentTaskId = taskId;

    // Create overlay if not exists
    if (!this.overlay) {
      this.createModal();
    }

    // Update iframe src
    const iframe = this.overlay?.querySelector<HTMLIFrameElement>(
      `.${MODAL_IFRAME_CLASS}`
    );
    const loading = this.overlay?.querySelector<HTMLDivElement>(
      `.${MODAL_LOADING_CLASS}`
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

    // Show overlay
    if (this.overlay) {
      this.overlay.style.display = "flex";
    }

    // Prevent body scroll
    document.body.style.overflow = "hidden";
  }

  hide(): void {
    if (this.overlay) {
      this.overlay.style.display = "none";

      // Clear iframe to stop loading
      const iframe = this.overlay.querySelector<HTMLIFrameElement>(
        `.${MODAL_IFRAME_CLASS}`
      );
      if (iframe) {
        iframe.src = "about:blank";
      }
    }

    this.currentTaskId = null;

    // Restore body scroll
    document.body.style.overflow = "";
  }

  destroy(): void {
    this.hide();
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }

  private createModal(): void {
    // Create overlay
    this.overlay = document.createElement("div");
    this.overlay.className = MODAL_OVERLAY_CLASS;

    // Create modal container
    const modal = document.createElement("div");
    modal.className = MODAL_CLASS;

    // Create header
    const header = document.createElement("div");
    header.className = MODAL_HEADER_CLASS;

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "clickup-modal-close";
    closeBtn.innerHTML = "✕";
    closeBtn.title = "닫기";
    closeBtn.onclick = () => this.hide();

    // Title
    const title = document.createElement("span");
    title.className = "clickup-modal-title";
    title.textContent = "ClickUp";

    // Actions container
    const actions = document.createElement("div");
    actions.className = "clickup-modal-actions";

    // Open in new tab button
    const newTabBtn = document.createElement("button");
    newTabBtn.className = "clickup-modal-btn";
    newTabBtn.innerHTML = "🔗 새 탭에서 열기";
    newTabBtn.onclick = () => {
      if (this.currentTaskId) {
        window.open(this.getIframeSrc(this.currentTaskId), "_blank");
      }
    };

    // Pin to side panel button
    const pinBtn = document.createElement("button");
    pinBtn.className = "clickup-modal-btn clickup-modal-btn-primary";
    pinBtn.innerHTML = "📌 사이드바로 고정";
    pinBtn.onclick = () => {
      if (this.currentTaskId && this.onPinToSidePanel) {
        this.onPinToSidePanel(this.currentTaskId);
      }
    };

    actions.appendChild(newTabBtn);
    actions.appendChild(pinBtn);

    header.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(actions);

    // Create loading indicator
    const loading = document.createElement("div");
    loading.className = MODAL_LOADING_CLASS;
    loading.textContent = "로딩 중...";

    // Create iframe
    const iframe = document.createElement("iframe");
    iframe.className = MODAL_IFRAME_CLASS;
    iframe.setAttribute("allow", "clipboard-read; clipboard-write");
    iframe.style.display = "none";

    // Assemble modal
    modal.appendChild(header);
    modal.appendChild(loading);
    modal.appendChild(iframe);

    this.overlay.appendChild(modal);

    // Close on overlay click
    this.overlay.onclick = (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    };

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible()) {
        this.hide();
      }
    });

    document.body.appendChild(this.overlay);
  }
}

/**
 * Singleton instance for easy access
 */
let modalInstance: Modal | null = null;

export function getModal(onPinToSidePanel?: (taskId: string) => void): Modal {
  if (!modalInstance) {
    modalInstance = new Modal(onPinToSidePanel);
  }
  return modalInstance;
}

export function showModal(taskId: string): void {
  getModal().show(taskId);
}

export function hideModal(): void {
  getModal().hide();
}

export function destroyModal(): void {
  if (modalInstance) {
    modalInstance.destroy();
    modalInstance = null;
  }
}
