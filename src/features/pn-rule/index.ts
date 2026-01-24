import { isPnRuleMap, PnRuleMapWithColor } from "@domain/pn";
import { getAllFromChromeLocalStorage, subscribeToChromeStorage } from "@utils/chrome";
import { createPnRuleObserver, disconnectPnRuleObserver } from "./observer";
import { replaceText } from "./replacer";

const STORAGE_KEY_ENABLED = "pn-rule-enabled";

let unsubscribeStorage: (() => void) | null = null;
let isActive = false;

/**
 * Starts the Pn rule feature
 */
async function startPnRule(): Promise<void> {
  if (isActive) return;

  const pnMap = await getAllFromChromeLocalStorage() as PnRuleMapWithColor;

  if (isPnRuleMap(pnMap)) {
    createPnRuleObserver(pnMap);
    isActive = true;
  }
}

/**
 * Stops the Pn rule feature
 */
function stopPnRule(): void {
  if (!isActive) return;

  disconnectPnRuleObserver();
  isActive = false;
}

/**
 * Initializes the Pn rule feature
 */
export async function initPnRule(): Promise<void> {
  const data = await getAllFromChromeLocalStorage();
  const pnMap = data as PnRuleMapWithColor;
  const isEnabled = data[STORAGE_KEY_ENABLED] !== false;

  unsubscribeStorage = subscribeToChromeStorage((changes) => {
    // Handle enabled state change
    if (STORAGE_KEY_ENABLED in changes) {
      const enabled = changes[STORAGE_KEY_ENABLED].newValue !== false;
      if (enabled) {
        startPnRule();
      } else {
        stopPnRule();
      }
      return;
    }

    // Handle pn rule map changes (only if active)
    if (isActive) {
      const tmpMap: Record<string, string> = {};
      Object.entries(changes).forEach(([key, change]) => {
        (pnMap as Record<string, unknown>)[key] = change.newValue;
        tmpMap[key] = change.newValue;
      });
      replaceText(tmpMap);
    }
  });

  if (isEnabled && isPnRuleMap(pnMap)) {
    createPnRuleObserver(pnMap);
    isActive = true;
  }
}

/**
 * Cleans up the Pn rule feature
 */
export function cleanupPnRule(): void {
  if (unsubscribeStorage) {
    unsubscribeStorage();
    unsubscribeStorage = null;
  }
  stopPnRule();
}
