/**
 * Plugin context providing shared services to plugins
 */

import { EventBus, eventBus } from '@core/events';
import { StorageService, storageService } from '@core/storage';
import * as gitlab from '@services/gitlab';

/**
 * Services available to plugins through context
 */
export interface PluginContext {
  /** Storage service for Chrome storage operations */
  storage: StorageService;
  /** Event bus for plugin communication */
  eventBus: EventBus;
  /** GitLab DOM accessor functions */
  gitlab: typeof gitlab;
}

/**
 * Creates a plugin context with all available services
 */
export function createPluginContext(): PluginContext {
  return {
    storage: storageService,
    eventBus: eventBus,
    gitlab,
  };
}
