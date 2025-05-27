"use strict";

// domain/html/index.ts
function genMarker({
  name,
  replacement,
  bgColor,
  textColor
}) {
  return `<mark name="${name}" style="background-color: ${bgColor}; color: ${textColor}">${replacement}</mark>`;
}

// domain/pn/index.ts
function getBgColorKey(pn) {
  return `${pn}-bg-color`.toLocaleLowerCase();
}
function getTextColorKey(pn) {
  return `${pn}-text-color`.toLocaleLowerCase();
}
function getReplacementKey(pn) {
  return pn.toLocaleLowerCase();
}
function pnRegexp() {
  return /^([pP]\d)\s*[:.]?/;
}
function findPn(text) {
  const match = text.match(pnRegexp());
  return match?.[1];
}
function isPnRule(rule = "") {
  return pnRegexp().test(rule);
}
function isPnRuleMap(map) {
  if (typeof map !== "object" || map === null) return false;
  return ["p1", "p2", "p3"].every((key) => key in map);
}

// utils/chrome/index.ts
function getAllFromChromeLocalStorage() {
  const { promise, resolve } = Promise.withResolvers();
  chrome.storage.local.get((data) => {
    resolve(data);
  });
  return promise;
}
function subscribeToChromeStorage(callback) {
  chrome.storage.onChanged.addListener(callback);
}

// utils/debounce.ts
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

// utils/html/index.ts
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// services/gitlab/index.ts
function getNotes() {
  return document.querySelectorAll("div.note-body > div.note-text.md [data-sourcepos][dir='auto']");
}

// inject/rm_mr_filter/utils.ts
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
  const siblings = li?.parentElement?.children;
  if (!li || !siblings || siblings.length === 0) {
    return;
  }
  const idx = Array.from(siblings).indexOf(li);
  if (idx === -1) {
    return;
  }
  filterList.splice(idx, 1);
  setFilterList(filterList);
}

// inject/rm_mr_filter/RemoveButton.ts
function RemoveButton() {
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.classList.add("custom-rm-btn");
  removeButton.innerHTML = `
<svg class="s16 close-icon"><use xlink:href="/assets/icons-0b41337f52be73f7bbf9d59b841eb98a6e790dfa1a844644f120a80ce3cc18ba.svg#close"></use></svg>
  `;
  return removeButton;
}

// inject/rm_mr_filter/index.ts
function findAllFilter() {
  const parent = document.querySelector("div.filtered-search-history-dropdown");
  if (!parent) return;
  const li = parent.querySelectorAll('li[data-testid="dropdown-item"]:not(.gl-text-subtle)');
  if (!li) return;
  return li;
}
function addRemoveButtonsToFilters() {
  const filterList = findAllFilter();
  filterList?.forEach((filter, idx) => {
    if (filter.querySelector(".custom-rm-btn")) {
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
function rmMrFilter() {
  const button = document.querySelector("button.filtered-search-history-dropdown-toggle-button");
  if (!button) return;
  const observer = new MutationObserver(addRemoveButtonsToFilters);
  observer.observe(button, { childList: true, subtree: true });
  addRemoveButtonsToFilters();
}

// inject/index.ts
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
async function init() {
  const pnMap = await getAllFromChromeLocalStorage();
  subscribeToChromeStorage((changes) => {
    const tmpMap = {};
    Object.entries(changes).forEach(([key, change]) => {
      pnMap[key] = change.newValue;
      tmpMap[key] = change.newValue;
    });
    replaceText(tmpMap);
  });
  const observer = new MutationObserver(
    debounce((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && isPnRuleMap(pnMap)) {
          replacePnText(pnMap);
        }
      });
    }, 20)
  );
  observer.observe(document.body, { childList: true, subtree: true });
}
init();
rmMrFilter();
