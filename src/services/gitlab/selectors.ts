/**
 * GitLab DOM Selectors
 * Centralized selectors for GitLab-specific elements
 */

export const SELECTORS = {
  // Note elements in MR discussion
  notes: "div.note-body > div.note-text.md [data-sourcepos][dir='auto']",

  // Filter dropdown elements
  filterDropdown: 'div.filtered-search-history-dropdown',
  filterDropdownButton: 'button.filtered-search-history-dropdown-toggle-button',
  filterListItem: 'li[data-testid="dropdown-item"]:not(.gl-text-subtle)',

  // Custom remove button class
  customRemoveButton: '.custom-rm-btn',
} as const;
