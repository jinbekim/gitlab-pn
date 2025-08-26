import { removeFilterByIndex } from "./utils";
import { RemoveButton } from "./ui/RemoveButton";

function findAllFilter() {
  const parent = document.querySelector('div.filtered-search-history-dropdown');
  if (!parent) return;

  const li = parent.querySelectorAll('li[data-testid="dropdown-item"]:not(.gl-text-subtle)');
  if (!li) return;

  return li;
}

function addRemoveButtonsToFilters() {
  const filterList = findAllFilter();

  filterList?.forEach((filter, idx) => {
    if (filter.querySelector('.custom-rm-btn')) {
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

export  default function rmMrFilter() {
  const button = document.querySelector('button.filtered-search-history-dropdown-toggle-button');
  if (!button) return;

  const observer = new MutationObserver(addRemoveButtonsToFilters);
  observer.observe(button, { childList: true, subtree: true });
  addRemoveButtonsToFilters();
}
