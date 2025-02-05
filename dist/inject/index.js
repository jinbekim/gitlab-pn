"use strict";

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

// inject/service/gitlab/index.ts
function getNotes() {
  return document.querySelectorAll("div.note-body > div.note-text.md [data-sourcepos][dir='auto']");
}

// utils/html/index.ts
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// inject/domain/html/index.ts
function genMarker({
  name,
  replacement,
  bgColor,
  textColor
}) {
  return `<mark name="${name}" style="background-color: ${bgColor}; color: ${textColor}">${replacement}</mark>`;
}

// inject/domain/regexp/index.ts
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

// inject/domain/pn/index.ts
function getBgColorKey(pn) {
  return `${pn}-bg-color`.toLocaleLowerCase();
}
function getTextColorKey(pn) {
  return `${pn}-text-color`.toLocaleLowerCase();
}
function getReplacementKey(pn) {
  return pn.toLocaleLowerCase();
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
  const observer = new MutationObserver(debounce((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && isPnRuleMap(pnMap)) {
        replacePnText(pnMap);
      }
    });
  }, 20));
  observer.observe(document.body, { childList: true, subtree: true });
}
init();
