/**
 * ClickUp Content Feature
 * Detects {{clickup:TASK_ID}} patterns and displays tasks in Modal/SidePanel
 */

import {
  createClickUpContentObserver,
  disconnectClickUpContentObserver,
} from "./observer";
import { detectAndTransformClickUpPatterns, resetProcessedState } from "./detector";
import { destroyModal, destroySidePanel } from "./ui";

/**
 * Initialize ClickUp content feature
 * - Sets up MutationObserver to watch for new content
 * - Performs initial scan of existing content
 */
export function initClickUpContent(): void {
  // Initial detection
  detectAndTransformClickUpPatterns();

  // Start observing for new content
  createClickUpContentObserver();
}

/**
 * Cleanup ClickUp content feature
 * - Disconnects observer
 * - Removes UI components
 */
export function cleanupClickUpContent(): void {
  disconnectClickUpContentObserver();
  resetProcessedState();
  destroyModal();
  destroySidePanel();
}
