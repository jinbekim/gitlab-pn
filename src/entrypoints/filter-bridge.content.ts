export default defineContentScript({
  matches: ['*://*/*/*/-/merge_requests*'],
  runAt: 'document_idle',
  world: 'MAIN',

  main() {
    const REMOVE_EVENT = '__rm_filter_remove__';

    window.addEventListener('message', (e) => {
      if (e.data?.type !== REMOVE_EVENT) return;
      removeViaVue(e.data.searchText, e.data.index ?? -1);
    });

    function findVueInstance() {
      const dropdownContent = document.querySelector(
        '.filtered-search-history-dropdown-content',
      );
      if (!dropdownContent) return null;

      const children = dropdownContent.querySelectorAll('*');
      for (let i = 0; i < children.length; i++) {
        const vue = (children[i] as any).__vue__;
        if (vue?.$options?.name === 'RecentSearchesDropdownContent') {
          return vue;
        }
      }
      return null;
    }

    /** "draft: = No" → "draft:=No", "author: != @jinbeom" → "author:!=@jinbeom" */
    function normalize(text: string): string {
      return text.replace(/\s*:\s*(!?=)\s*/g, ':$1');
    }

    function removeViaVue(searchText: string, index: number): boolean {
      const vm = findVueInstance();
      const recentSearches = vm?.$parent?.$data?.recentSearches;
      if (!Array.isArray(recentSearches)) {
        window.postMessage({ type: '__rm_filter_done__', success: false }, '*');
        return false;
      }

      // 1차: index로 직접 삭제 (DOM 순서 = 배열 순서)
      let targetIdx = -1;
      if (index >= 0 && index < recentSearches.length) {
        targetIdx = index;
      }

      // 2차 fallback: 텍스트 매칭 (index 무효 시)
      if (targetIdx === -1) {
        const normalized = normalize(searchText);
        targetIdx = recentSearches.findIndex((item: unknown) => {
          if (typeof item === 'string') return item === normalized;
          if (Array.isArray(item)) return normalize(item.join(' ')) === normalized;
          return false;
        });
      }

      if (targetIdx === -1) {
        window.postMessage({ type: '__rm_filter_done__', success: false }, '*');
        return false;
      }

      recentSearches.splice(targetIdx, 1);
      syncLocalStorage(recentSearches);

      // Wait for Vue re-render, then notify ISOLATED world to re-inject custom elements
      vm!.$nextTick(() => {
        window.postMessage({ type: '__rm_filter_done__', success: true }, '*');
      });

      return true;
    }

    function syncLocalStorage(searches: unknown[]) {
      const [project] = window.location.pathname.split('/-/');
      if (!project) return;
      const key = project.slice(1) + '-merge-request-recent-searches';
      localStorage.setItem(key, JSON.stringify(searches));
    }
  },
});
