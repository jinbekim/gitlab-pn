import { createObserver, disconnectObserver } from "@utils/observer";
import { debounce } from "@utils/debounce";
import { detectAndTransformClickUpPatterns } from "./detector";

const OBSERVER_ID = "clickup-content-observer";

/**
 * Creates a MutationObserver that watches for DOM changes
 * and detects ClickUp patterns in new content
 */
export function createClickUpContentObserver(): void {
  const debouncedCallback = debounce(() => {
    detectAndTransformClickUpPatterns();
  }, 100);

  createObserver({
    id: OBSERVER_ID,
    target: document.body,
    callback: debouncedCallback,
    config: { childList: true, subtree: true },
  });
}

/**
 * Disconnects the ClickUp content observer
 */
export function disconnectClickUpContentObserver(): void {
  disconnectObserver(OBSERVER_ID);
}
