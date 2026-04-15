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

  // DOM 인덱스 계산 (형제 필터 항목 중 순서)
  const parent = li.parentElement;
  const siblings = parent
    ? Array.from(parent.querySelectorAll('li[data-testid="dropdown-item"]:not(.gl-text-subtle)'))
    : [];
  const index = siblings.indexOf(li as Element);

  const searchButton = li.querySelector('button.filtered-search-history-dropdown-item');
  const searchText = searchButton?.textContent?.trim() ?? '';
  if (!searchText) return;

  // Dispatch to MAIN world for Vue reactive removal + localStorage sync
  window.postMessage({ type: '__rm_filter_remove__', searchText, index }, '*');

  // Bridge 결과 대기: 성공 시 Vue가 모든 처리, 실패 시 localStorage fallback + DOM 제거
  const onResult = (ev: MessageEvent) => {
    if (ev.data?.type !== '__rm_filter_done__') return;
    window.removeEventListener('message', onResult);
    if (!ev.data.success) {
      // Vue 삭제 실패 → localStorage 직접 수정 + DOM 제거
      const filterList = getFilterList();
      if (index >= 0 && index < filterList.length) {
        filterList.splice(index, 1);
        setFilterList(filterList);
      }
      if (li.parentNode) li.remove();
    }
  };
  window.addEventListener('message', onResult);
}
