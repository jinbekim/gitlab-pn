/**
 * Chrome storage API wrappers with error handling
 */

export type StorageResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: Error;
};

/**
 * Saves data to Chrome local storage
 */
export function saveToChromeLocalStorage(map: Record<string, unknown>): Promise<StorageResult<void>> {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.set(map, () => {
        if (chrome.runtime.lastError) {
          resolve({
            success: false,
            error: new Error(chrome.runtime.lastError.message),
          });
        } else {
          resolve({ success: true, data: undefined });
        }
      });
    } catch (error) {
      resolve({
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      });
    }
  });
}

/**
 * Gets all data from Chrome local storage
 */
export function getAllFromChromeLocalStorage(): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get((data) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(data);
        }
      });
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

/**
 * Subscribes to Chrome storage changes
 * Returns an unsubscribe function
 */
export function subscribeToChromeStorage(
  callback: (changes: { [k: string]: chrome.storage.StorageChange }) => void
): () => void {
  chrome.storage.onChanged.addListener(callback);
  return () => {
    chrome.storage.onChanged.removeListener(callback);
  };
}
