import { getFilterDropdownButton, getFilterListItems, SELECTORS } from "@services/gitlab";
import { createObserver, disconnectObserver } from "@utils/observer";
import { removeFilterByIndex } from "./utils";
import { RemoveButton } from "./ui/RemoveButton";

const OBSERVER_ID = "rm-mr-filter-observer";

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
 * Initializes the filter removal feature
 */
export function initRmMrFilter(): void {
  const button = getFilterDropdownButton();
  if (!button) return;

  createObserver({
    id: OBSERVER_ID,
    target: button,
    callback: addRemoveButtonsToFilters,
    config: { childList: true, subtree: true },
  });

  addRemoveButtonsToFilters();
}

/**
 * Cleans up the filter removal feature
 */
export function cleanupRmMrFilter(): void {
  disconnectObserver(OBSERVER_ID);
}
