/**
 * MutationObserver management utilities
 */

type ObserverEntry = {
  observer: MutationObserver;
  target: Node;
};

const observers: Map<string, ObserverEntry> = new Map();

export interface ObserverOptions {
  id: string;
  target: Node;
  callback: MutationCallback;
  config?: MutationObserverInit;
}

const defaultConfig: MutationObserverInit = {
  childList: true,
  subtree: true,
};

/**
 * Creates and registers a MutationObserver
 */
export function createObserver(options: ObserverOptions): MutationObserver {
  const { id, target, callback, config = defaultConfig } = options;

  // Disconnect existing observer with same id
  if (observers.has(id)) {
    disconnectObserver(id);
  }

  const observer = new MutationObserver(callback);
  observer.observe(target, config);

  observers.set(id, { observer, target });

  return observer;
}

/**
 * Disconnects a specific observer by id
 */
export function disconnectObserver(id: string): boolean {
  const entry = observers.get(id);
  if (entry) {
    entry.observer.disconnect();
    observers.delete(id);
    return true;
  }
  return false;
}

/**
 * Disconnects all registered observers
 */
export function disconnectAllObservers(): void {
  observers.forEach((entry) => {
    entry.observer.disconnect();
  });
  observers.clear();
}

/**
 * Gets the count of active observers
 */
export function getObserverCount(): number {
  return observers.size;
}
