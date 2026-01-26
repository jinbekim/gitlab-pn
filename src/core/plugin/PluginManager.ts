/**
 * Plugin lifecycle manager
 */

import { storageService, type StorageChanges } from '@core/storage';
import { createPluginContext, type PluginContext } from './PluginContext';
import type { Plugin } from './types';

/**
 * PluginManager handles plugin lifecycle and coordination
 */
export class PluginManager {
  private plugins: Map<string, Plugin> = new Map();
  private context: PluginContext;
  private unsubscribeStorage: (() => void) | null = null;

  constructor() {
    this.context = createPluginContext();
  }

  /**
   * Register a plugin with the manager
   * @param plugin Plugin instance to register
   */
  register(plugin: Plugin): void {
    if (this.plugins.has(plugin.meta.id)) {
      console.warn(`Plugin ${plugin.meta.id} is already registered`);
      return;
    }
    this.plugins.set(plugin.meta.id, plugin);
  }

  /**
   * Initialize all registered plugins
   */
  async initAll(): Promise<void> {
    // Initialize storage service first
    await storageService.init();

    // Subscribe to storage changes
    this.unsubscribeStorage = storageService.subscribe((changes) => {
      this.handleStorageChanges(changes);
    });

    // Get initial storage data
    const storageData = await storageService.getAll();

    // Initialize and start each plugin
    for (const plugin of this.plugins.values()) {
      try {
        await plugin.init(this.context);

        // Check if plugin should be enabled (default to true if not set)
        const isEnabled = storageData[plugin.meta.enabledKey] !== false;

        if (isEnabled) {
          await plugin.start();
        }
      } catch (error) {
        console.error(`Failed to initialize plugin ${plugin.meta.id}:`, error);
      }
    }
  }

  /**
   * Cleanup all plugins
   */
  cleanupAll(): void {
    // Unsubscribe from storage changes
    if (this.unsubscribeStorage) {
      this.unsubscribeStorage();
      this.unsubscribeStorage = null;
    }

    // Cleanup each plugin
    for (const plugin of this.plugins.values()) {
      try {
        plugin.cleanup();
      } catch (error) {
        console.error(`Failed to cleanup plugin ${plugin.meta.id}:`, error);
      }
    }

    this.plugins.clear();
  }

  /**
   * Handle storage changes and route to appropriate plugins
   */
  private handleStorageChanges(changes: StorageChanges): void {
    for (const plugin of this.plugins.values()) {
      // Check for enabled state changes
      if (plugin.meta.enabledKey in changes) {
        const enabled = changes[plugin.meta.enabledKey].newValue !== false;
        if (enabled && plugin.state !== 'active') {
          plugin.start();
        } else if (!enabled && plugin.state === 'active') {
          plugin.stop();
        }
      }

      // Forward storage changes to plugin
      if (plugin.onStorageChange) {
        try {
          plugin.onStorageChange(changes);
        } catch (error) {
          console.error(`Plugin ${plugin.meta.id} error handling storage change:`, error);
        }
      }
    }
  }
}

/**
 * Shared plugin manager instance
 */
export const pluginManager = new PluginManager();
