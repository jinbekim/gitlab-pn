/**
 * Interface for iframe container components
 * Allows easy switching between different UI modes (Modal, SidePanel, etc.)
 */
export interface IframeContainer {
  /**
   * Show the container with the given task
   */
  show(taskId: string): void;

  /**
   * Hide the container
   */
  hide(): void;

  /**
   * Get the iframe source URL for a task
   */
  getIframeSrc(taskId: string): string;

  /**
   * Check if the container is currently visible
   */
  isVisible(): boolean;

  /**
   * Get the current task ID being displayed
   */
  getCurrentTaskId(): string | null;

  /**
   * Cleanup and remove the container from DOM
   */
  destroy(): void;
}

/**
 * Display mode for ClickUp content
 */
export type DisplayMode = "modal" | "side-panel" | "floating";
