/**
 * Pin storage utilities for MR filter history
 * Manages pinned filters that persist across sessions
 */

/**
 * Generate storage key based on current project path
 */
export function getPinStorageKey(): string {
  const { href } = location;
  const match = href.match(/\/([^/]+\/[^/]+)\/-\/merge_requests/);
  const slug = match?.[1] ?? '';
  return `pinned-filters:${slug}`;
}

/**
 * Check if a filter is in the pinned list
 */
export function isPinned(filter: string, pinned: string[]): boolean {
  return pinned.includes(filter);
}

/**
 * Reorder filters so pinned ones come first, preserving relative order
 */
export function reorderWithPinnedFirst(filters: string[], pinned: string[]): string[] {
  const pinnedSet = new Set(pinned);
  const pinnedFilters = filters.filter((f) => pinnedSet.has(f));
  const unpinnedFilters = filters.filter((f) => !pinnedSet.has(f));
  return [...pinnedFilters, ...unpinnedFilters];
}

/**
 * Append any pinned filters that are missing from the current filter list
 */
export function restoreMissingPinned(filters: string[], pinned: string[]): string[] {
  const existing = new Set(filters);
  const missing = pinned.filter((p) => !existing.has(p));
  return [...filters, ...missing];
}
