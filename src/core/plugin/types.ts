/**
 * Plugin system types and base classes
 */

import type { PluginContext } from './PluginContext';

/**
 * Plugin metadata
 */
export interface PluginMeta {
  /** Unique identifier for the plugin */
  id: string;
  /** Human-readable name */
  name: string;
  /** Plugin version */
  version: string;
  /** Storage key for enabled state */
  enabledKey: string;
}

/**
 * Plugin lifecycle states
 */
export type PluginState = 'registered' | 'initialized' | 'active' | 'inactive';

/**
 * Storage change event type
 */
export type StorageChanges = { [key: string]: chrome.storage.StorageChange };

/**
 * Plugin interface defining the contract for all plugins
 */
export interface Plugin {
  /** Plugin metadata */
  readonly meta: PluginMeta;
  /** Current state of the plugin */
  readonly state: PluginState;

  /**
   * Initialize the plugin with context
   * Called once when plugin is first loaded
   */
  init(context: PluginContext): Promise<void>;

  /**
   * Start the plugin functionality
   * Called when plugin is enabled
   */
  start(): Promise<void>;

  /**
   * Stop the plugin functionality
   * Called when plugin is disabled
   */
  stop(): void;

  /**
   * Cleanup the plugin
   * Called when plugin is being unloaded
   */
  cleanup(): void;

  /**
   * Handle storage changes
   * Called when Chrome storage changes
   */
  onStorageChange?(changes: StorageChanges): void;
}

/**
 * Abstract base class for plugins
 * Provides common functionality and state management
 */
export abstract class BasePlugin implements Plugin {
  abstract readonly meta: PluginMeta;

  protected _state: PluginState = 'registered';
  protected context!: PluginContext;

  get state(): PluginState {
    return this._state;
  }

  async init(context: PluginContext): Promise<void> {
    this.context = context;
    this._state = 'initialized';
  }

  async start(): Promise<void> {
    if (this._state === 'active') return;
    this._state = 'active';
  }

  stop(): void {
    if (this._state !== 'active') return;
    this._state = 'inactive';
  }

  cleanup(): void {
    this.stop();
    this._state = 'registered';
  }

  onStorageChange?(changes: StorageChanges): void;
}
