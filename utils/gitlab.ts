export const generateDividerEl = () => {
  const divider = document.createElement("li");
  divider.classList.add("divider");
  return divider;
};

export const findRecentSearchButtonEl = () => {
  return document.querySelector(
    "button.dropdown-menu-toggle.filtered-search-history-dropdown-toggle-button"
  );
};

export const findAllRecentSearchItemEls = () => {
  return document.querySelectorAll('li[data-testid="dropdown-item"]');
};

export const findFilterTokenEls = (searchItem: Element) => {
  return searchItem.querySelectorAll("span.filtered-search-history-dropdown-token");
};

export const splitTokenElToString = (filterToken: Element) => {
  const text = filterToken.textContent;
  const [key, operator, value] = text?.split(" ") || [];
  return { key, operator, value };
};

export const pinSearchItem = (searchItem: Element) => {
  // TODO
  throw new Error("Not implemented");
};

export const unpinSearchItem = (searchItem: Element) => {
  // TODO
  throw new Error("Not implemented");
};
