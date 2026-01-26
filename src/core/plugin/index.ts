/**
 * Plugin system exports
 */

export { PluginManager, pluginManager } from './PluginManager';
export { createPluginContext, type PluginContext } from './PluginContext';
export {
  BasePlugin,
  type Plugin,
  type PluginMeta,
  type PluginState,
  type StorageChanges,
} from './types';
export { PLUGIN_REGISTRY, type PluginInfo } from './registry';
