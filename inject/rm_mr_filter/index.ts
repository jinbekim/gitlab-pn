import { removeFilterByIndex } from "./utils";
import { RemoveButton } from "./RemoveButton";

function findAllFilter() {
  const ul = document.querySelector('#disclosure-46');
  if (!ul) return;

  const li = ul.querySelectorAll('li.gl-new-dropdown-item:not(.gl-text-subtle)');
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
  const button = document.querySelector('.input-group-prepend');
  if (!button) return;

  const observer = new MutationObserver(addRemoveButtonsToFilters);
  observer.observe(button, { childList: true, subtree: true });
  addRemoveButtonsToFilters();
}
