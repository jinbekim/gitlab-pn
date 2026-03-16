/**
 * Content script entry point
 * Uses PluginManager to orchestrate plugin lifecycle
 */

import 'virtual:uno.css';
import '../../styles/inject.css';
import { pluginManager } from '@core/plugin';
import { PnRulePlugin } from '@plugins/pn-rule';
import { RmMrFilterPlugin } from '@plugins/rm-mr-filter';
import { MrDescViewerPlugin } from '@plugins/mr-desc-viewer';

// Register all plugins
pluginManager.register(new PnRulePlugin());
pluginManager.register(new RmMrFilterPlugin());
pluginManager.register(new MrDescViewerPlugin());

// Initialize all plugins
pluginManager.initAll();

// Cleanup on unload (for SPA navigation)
window.addEventListener('beforeunload', () => pluginManager.cleanupAll());
