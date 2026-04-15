type FilterList = unknown[];

export function getKey() {
  const url = new URL(window.location.href);
  const pathname = url.pathname;
  const [project] = pathname.split('/-/');
  return `${project.slice(1)}-merge-request-recent-searches`;
}

export function getFilterList() {
  const key = getKey();
  const value = localStorage.getItem(key);
  if (!value) return [];
  return JSON.parse(value) as FilterList;
}

export function setFilterList(filterList: FilterList) {
  const key = getKey();
  localStorage.setItem(key, JSON.stringify(filterList));
}

export function removeFilterByText(e: MouseEvent) {
  const li = (e.target as HTMLElement).closest('li[data-testid="dropdown-item"]');
  if (!li) return;

  const searchButton = li.querySelector('button.filtered-search-history-dropdown-item');
  const searchText = searchButton?.textContent?.trim() ?? '';
  if (!searchText) return;

  // Dispatch to MAIN world for Vue reactive removal + localStorage sync
  window.postMessage({ type: '__rm_filter_remove__', searchText }, '*');

  // Fallback: also remove from localStorage directly
  // (in case MAIN world script hasn't loaded)
  // Normalize "draft: = No" → "draft:=No" to match stored format
  const normalized = searchText.replace(/\s*:\s*(!?=)\s*/g, ':$1');
  const filterList = getFilterList();
  const idx = filterList.findIndex((item: unknown) => {
    if (typeof item === 'string') return item === normalized;
    if (Array.isArray(item)) {
      return (item as string[]).join(' ').replace(/\s*:\s*(!?=)\s*/g, ':$1') === normalized;
    }
    return false;
  });
  if (idx !== -1) {
    filterList.splice(idx, 1);
    setFilterList(filterList);
  }

  // Vue 삭제 실패 시에만 DOM 직접 제거 (Vue 미관여이므로 vdom 충돌 없음)
  const onResult = (ev: MessageEvent) => {
    if (ev.data?.type !== '__rm_filter_done__') return;
    window.removeEventListener('message', onResult);
    if (!ev.data.success && li.parentNode) {
      li.remove();
    }
  };
  window.addEventListener('message', onResult);
}
