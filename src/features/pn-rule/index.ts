import { isPnRuleMap, PnRuleMapWithColor } from "@domain/pn";
import { getAllFromChromeLocalStorage, subscribeToChromeStorage } from "@utils/chrome";
import { createPnRuleObserver, disconnectPnRuleObserver } from "./observer";
import { replaceText } from "./replacer";

let unsubscribeStorage: (() => void) | null = null;

/**
 * Initializes the Pn rule feature
 */
export async function initPnRule(): Promise<void> {
  const pnMap = await getAllFromChromeLocalStorage() as PnRuleMapWithColor;

  unsubscribeStorage = subscribeToChromeStorage((changes) => {
    const tmpMap: Record<string, string> = {};
    Object.entries(changes).forEach(([key, change]) => {
      (pnMap as Record<string, unknown>)[key] = change.newValue;
      tmpMap[key] = change.newValue;
    });
    replaceText(tmpMap);
  });

  if (isPnRuleMap(pnMap)) {
    createPnRuleObserver(pnMap);
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
  disconnectPnRuleObserver();
}
