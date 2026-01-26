/**
 * Content script entry point
 * Uses PluginManager to orchestrate plugin lifecycle
 */

import { pluginManager } from '@core/plugin';
import { PnRulePlugin } from '@plugins/pn-rule';
import { RmMrFilterPlugin } from '@plugins/rm-mr-filter';

// Register all plugins
pluginManager.register(new PnRulePlugin());
pluginManager.register(new RmMrFilterPlugin());

// Initialize all plugins
pluginManager.initAll();

// Cleanup on unload (for SPA navigation)
window.addEventListener('beforeunload', () => pluginManager.cleanupAll());
