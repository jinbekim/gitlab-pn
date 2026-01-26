/**
 * Typed storage service wrapping Chrome storage API
 */

import {
  getAllFromChromeLocalStorage,
  saveToChromeLocalStorage,
  subscribeToChromeStorage,
  type StorageResult,
} from '@utils/chrome';

export type { StorageResult };

export type StorageChanges = { [key: string]: chrome.storage.StorageChange };

/**
 * StorageService provides typed access to Chrome storage
 */
export class StorageService {
  private cache: Record<string, unknown> = {};
  private initialized = false;

  /**
   * Initialize the storage service by loading all data
   */
  async init(): Promise<void> {
    if (this.initialized) return;
    this.cache = await getAllFromChromeLocalStorage();
    this.initialized = true;
  }

  /**
   * Get all storage data
   */
  async getAll(): Promise<Record<string, unknown>> {
    if (!this.initialized) {
      await this.init();
    }
    return { ...this.cache };
  }

  /**
   * Get a specific value from storage
   * @param key Storage key
   * @param defaultValue Default value if key doesn't exist
   */
  async get<T>(key: string, defaultValue?: T): Promise<T | undefined> {
    if (!this.initialized) {
      await this.init();
    }
    const value = this.cache[key];
    return value !== undefined ? (value as T) : defaultValue;
  }

  /**
   * Save data to storage
   * @param data Data to save
   */
  async save(data: Record<string, unknown>): Promise<StorageResult<void>> {
    const result = await saveToChromeLocalStorage(data);
    if (result.success) {
      // Update cache
      Object.assign(this.cache, data);
    }
    return result;
  }

  /**
   * Subscribe to storage changes
   * @param callback Callback for storage changes
   * @returns Unsubscribe function
   */
  subscribe(callback: (changes: StorageChanges) => void): () => void {
    return subscribeToChromeStorage((changes) => {
      // Update cache with changes
      Object.entries(changes).forEach(([key, change]) => {
        if (change.newValue !== undefined) {
          this.cache[key] = change.newValue;
        } else {
          delete this.cache[key];
        }
      });
      callback(changes);
    });
  }
}

/**
 * Shared storage service instance
 */
export const storageService = new StorageService();
