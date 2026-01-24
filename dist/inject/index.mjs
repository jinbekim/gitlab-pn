import {
  findPn,
  getAllFromChromeLocalStorage,
  getBgColorKey,
  getReplacementKey,
  getTextColorKey,
  isPnRule,
  isPnRuleMap,
  subscribeToChromeStorage
} from "../chunk-7NDE5PE2.mjs";

// src/utils/observer/index.ts
var observers = /* @__PURE__ */ new Map();
var defaultConfig = {
  childList: true,
  subtree: true
};
function createObserver(options) {
  const { id, target, callback, config = defaultConfig } = options;
  if (observers.has(id)) {
    disconnectObserver(id);
  }
  const observer = new MutationObserver(callback);
  observer.observe(target, config);
  observers.set(id, { observer, target });
  return observer;
}
function disconnectObserver(id) {
  const entry = observers.get(id);
  if (entry) {
    entry.observer.disconnect();
    observers.delete(id);
    return true;
  }
  return false;
}

// src/utils/debounce.ts
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      timeout = void 0;
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// src/domain/html/index.ts
function genMarker({
  name,
  replacement,
  bgColor,
  textColor
}) {
  return `<mark name="${name}" style="background-color: ${bgColor}; color: ${textColor}">${replacement}</mark>`;
}

// src/services/gitlab/selectors.ts
var SELECTORS = {
  // Note elements in MR discussion
  notes: "div.note-body > div.note-text.md [data-sourcepos][dir='auto']",
  // Filter dropdown elements
  filterDropdown: "div.filtered-search-history-dropdown",
  filterDropdownButton: "button.filtered-search-history-dropdown-toggle-button",
  filterListItem: 'li[data-testid="dropdown-item"]:not(.gl-text-subtle)',
  // Custom remove button class
  customRemoveButton: ".custom-rm-btn"
};

// src/services/gitlab/index.ts
function getNotes() {
  return document.querySelectorAll(SELECTORS.notes);
}
function getFilterDropdown() {
  return document.querySelector(SELECTORS.filterDropdown);
}
function getFilterDropdownButton() {
  return document.querySelector(SELECTORS.filterDropdownButton);
}
function getFilterListItems() {
  const dropdown = getFilterDropdown();
  if (!dropdown) return null;
  return dropdown.querySelectorAll(SELECTORS.filterListItem);
}

// src/utils/html/index.ts
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// src/features/pn-rule/replacer.ts
function replaceText(replacementMap) {
  const marks = document.querySelectorAll("mark[name]");
  marks.forEach((mark) => {
    if (!(mark instanceof HTMLElement)) return;
    const rule = mark.getAttribute("name")?.toLocaleLowerCase();
    if (!isPnRule(rule)) return;
    for (const key of Object.keys(replacementMap)) {
      if (key.startsWith(rule)) {
        const replacementKey = getReplacementKey(rule);
        const bgColorKey = getBgColorKey(rule);
        const textColorKey = getTextColorKey(rule);
        if (replacementMap[replacementKey]) {
          mark.textContent = escapeHtml(replacementMap[replacementKey]);
        }
        if (replacementMap[bgColorKey]) {
          mark.style.backgroundColor = replacementMap[bgColorKey];
        }
        if (replacementMap[textColorKey]) {
          mark.style.color = replacementMap[textColorKey];
        }
      }
    }
  });
}
function replacePnText(replacementMap) {
  const notes = getNotes();
  notes.forEach((note) => {
    const pn = findPn(note.innerHTML);
    if (pn && pn.toLowerCase() in replacementMap) {
      const replacementKey = getReplacementKey(pn);
      const bgColorKey = getBgColorKey(pn);
      const textColorKey = getTextColorKey(pn);
      note.innerHTML = note.innerHTML.replace(
        pn,
        genMarker({
          name: pn,
          bgColor: replacementMap[bgColorKey],
          textColor: replacementMap[textColorKey],
          replacement: escapeHtml(replacementMap[replacementKey])
        })
      );
    }
  });
}

// src/features/pn-rule/observer.ts
var OBSERVER_ID = "pn-rule-observer";
function createPnRuleObserver(pnMap) {
  const debouncedCallback = debounce((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && isPnRuleMap(pnMap)) {
        replacePnText(pnMap);
      }
    });
  }, 20);
  createObserver({
    id: OBSERVER_ID,
    target: document.body,
    callback: debouncedCallback,
    config: { childList: true, subtree: true }
  });
}
function disconnectPnRuleObserver() {
  disconnectObserver(OBSERVER_ID);
}

// src/features/pn-rule/index.ts
var unsubscribeStorage = null;
async function initPnRule() {
  const pnMap = await getAllFromChromeLocalStorage();
  unsubscribeStorage = subscribeToChromeStorage((changes) => {
    const tmpMap = {};
    Object.entries(changes).forEach(([key, change]) => {
      pnMap[key] = change.newValue;
      tmpMap[key] = change.newValue;
    });
    replaceText(tmpMap);
  });
  if (isPnRuleMap(pnMap)) {
    createPnRuleObserver(pnMap);
  }
}
function cleanupPnRule() {
  if (unsubscribeStorage) {
    unsubscribeStorage();
    unsubscribeStorage = null;
  }
  disconnectPnRuleObserver();
}

// src/features/rm-mr-filter/utils.ts
function getKey() {
  const url = new URL(window.location.href);
  const pathname = url.pathname;
  const [project] = pathname.split("/-/");
  return `${project.slice(1)}-merge-request-recent-searches`;
}
function getFilterList() {
  const key = getKey();
  const value = localStorage.getItem(key);
  if (!value) return [];
  return JSON.parse(value);
}
function setFilterList(filterList) {
  const key = getKey();
  localStorage.setItem(key, JSON.stringify(filterList));
}
function removeFilterByIndex(e) {
  const filterList = getFilterList();
  const li = e.target.parentElement?.parentElement;
  const siblings = Array.from(li?.parentElement?.children ?? []);
  if (!li || siblings.length === 0) {
    console.warn(`cannot find li or siblings`);
    return;
  }
  const idx = siblings.indexOf(li);
  if (idx === -1) {
    console.warn(`cannot find index of ${li} from ${siblings}`);
    return;
  }
  console.log(`remove filter at index ${idx}`, filterList);
  filterList.splice(idx, 1);
  setFilterList(filterList);
}

// src/features/rm-mr-filter/ui/RemoveButton.ts
function RemoveButton() {
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.classList.add("custom-rm-btn");
  removeButton.innerHTML = `
<svg class="s16 close-icon"><use xlink:href="/assets/icons-0b41337f52be73f7bbf9d59b841eb98a6e790dfa1a844644f120a80ce3cc18ba.svg#close"></use></svg>
  `;
  return removeButton;
}

// src/features/rm-mr-filter/index.ts
var OBSERVER_ID2 = "rm-mr-filter-observer";
function addRemoveButtonsToFilters() {
  const filterList = getFilterListItems();
  filterList?.forEach((filter) => {
    if (filter.querySelector(SELECTORS.customRemoveButton)) {
      return;
    }
    const removeButton = RemoveButton();
    filter.appendChild(removeButton);
    removeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      removeFilterByIndex(e);
      filter.remove();
    });
  });
}
function initRmMrFilter() {
  const button = getFilterDropdownButton();
  if (!button) return;
  createObserver({
    id: OBSERVER_ID2,
    target: button,
    callback: addRemoveButtonsToFilters,
    config: { childList: true, subtree: true }
  });
  addRemoveButtonsToFilters();
}
function cleanupRmMrFilter() {
  disconnectObserver(OBSERVER_ID2);
}

// src/features/inject/index.ts
async function init() {
  await initPnRule();
  initRmMrFilter();
}
function cleanup() {
  cleanupPnRule();
  cleanupRmMrFilter();
}
init();
window.addEventListener("beforeunload", cleanup);
//# sourceMappingURL=index.mjs.map