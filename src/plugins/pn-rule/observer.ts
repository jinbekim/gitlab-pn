import { isPnRuleMap, PnRuleMapWithColor } from "@domain/pn";
import { createObserver, disconnectObserver } from "@utils/observer";
import { debounce } from "@utils/debounce";
import { replacePnText } from "./replacer";

const OBSERVER_ID = "pn-rule-observer";

/**
 * Creates a MutationObserver that watches for DOM changes
 * and applies Pn text replacements
 */
export function createPnRuleObserver(pnMap: PnRuleMapWithColor): void {
  const debouncedCallback = debounce((mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && isPnRuleMap(pnMap)) {
        replacePnText(pnMap);
      }
    });
  }, 20);

  createObserver({
    id: OBSERVER_ID,
    target: document.body,
    callback: debouncedCallback,
    config: { childList: true, subtree: true },
  });
}

/**
 * Disconnects the Pn rule observer
 */
export function disconnectPnRuleObserver(): void {
  disconnectObserver(OBSERVER_ID);
}
