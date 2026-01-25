/**
 * Content script entry point
 * Orchestrates feature initialization and cleanup
 */

import { initPnRule, cleanupPnRule } from "@features/pn-rule";
import { initRmMrFilter, cleanupRmMrFilter } from "@features/rm-mr-filter";
import { initClickUpContent, cleanupClickUpContent } from "@features/clickup-content";

/**
 * Initialize all features
 */
async function init(): Promise<void> {
  await initPnRule();
  initRmMrFilter();
  initClickUpContent();
}

/**
 * Cleanup all features
 */
function cleanup(): void {
  cleanupPnRule();
  cleanupRmMrFilter();
  cleanupClickUpContent();
}

// Initialize on load
init();

// Cleanup on unload (for SPA navigation)
window.addEventListener('beforeunload', cleanup);
