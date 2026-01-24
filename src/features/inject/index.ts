/**
 * Content script entry point
 * Orchestrates feature initialization and cleanup
 */

import { initPnRule, cleanupPnRule } from "@features/pn-rule";
import { initRmMrFilter, cleanupRmMrFilter } from "@features/rm-mr-filter";

/**
 * Initialize all features
 */
async function init(): Promise<void> {
  await initPnRule();
  initRmMrFilter();
}

/**
 * Cleanup all features
 */
function cleanup(): void {
  cleanupPnRule();
  cleanupRmMrFilter();
}

// Initialize on load
init();

// Cleanup on unload (for SPA navigation)
window.addEventListener('beforeunload', cleanup);
