import { SELECTORS } from './selectors';

export function getNotes() {
  return document.querySelectorAll(SELECTORS.notes);
}

export function getFilterDropdown() {
  return document.querySelector(SELECTORS.filterDropdown);
}

export function getFilterDropdownButton() {
  return document.querySelector(SELECTORS.filterDropdownButton);
}

export function getFilterListItems() {
  const dropdown = getFilterDropdown();
  if (!dropdown) return null;
  return dropdown.querySelectorAll(SELECTORS.filterListItem);
}

export { SELECTORS };
