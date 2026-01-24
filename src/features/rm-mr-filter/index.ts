import { getFilterDropdownButton, getFilterListItems, SELECTORS } from "@services/gitlab";
import { createObserver, disconnectObserver } from "@utils/observer";
import { getAllFromChromeLocalStorage, subscribeToChromeStorage } from "@utils/chrome";
import { removeFilterByIndex } from "./utils";
import { RemoveButton } from "./ui/RemoveButton";

const OBSERVER_ID = "rm-mr-filter-observer";
const STORAGE_KEY_ENABLED = "rm-mr-filter-enabled";

let unsubscribeStorage: (() => void) | null = null;
let isActive = false;

function addRemoveButtonsToFilters(): void {
  const filterList = getFilterListItems();

  filterList?.forEach((filter) => {
    if (filter.querySelector(SELECTORS.customRemoveButton)) {
      return;
    }
    const removeButton = RemoveButton();

    filter.appendChild(removeButton);

    removeButton.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      removeFilterByIndex(e);
      filter.remove();
    });
  });
}

/**
 * Starts the filter removal feature
 */
function startRmMrFilter(): void {
  if (isActive) return;

  const button = getFilterDropdownButton();
  if (!button) return;

  createObserver({
    id: OBSERVER_ID,
    target: button,
    callback: addRemoveButtonsToFilters,
    config: { childList: true, subtree: true },
  });

  addRemoveButtonsToFilters();
  isActive = true;
}

/**
 * Stops the filter removal feature
 */
function stopRmMrFilter(): void {
  if (!isActive) return;

  disconnectObserver(OBSERVER_ID);
  isActive = false;
}

/**
 * Initializes the filter removal feature
 */
export async function initRmMrFilter(): Promise<void> {
  const data = await getAllFromChromeLocalStorage();
  const isEnabled = data[STORAGE_KEY_ENABLED] !== false;

  unsubscribeStorage = subscribeToChromeStorage((changes) => {
    if (STORAGE_KEY_ENABLED in changes) {
      const enabled = changes[STORAGE_KEY_ENABLED].newValue !== false;
      if (enabled) {
        startRmMrFilter();
      } else {
        stopRmMrFilter();
      }
    }
  });

  if (isEnabled) {
    startRmMrFilter();
  }
}

/**
 * Cleans up the filter removal feature
 */
export function cleanupRmMrFilter(): void {
  if (unsubscribeStorage) {
    unsubscribeStorage();
    unsubscribeStorage = null;
  }
  stopRmMrFilter();
}
