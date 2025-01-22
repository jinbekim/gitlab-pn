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
function getBgColorKey(pn) {
  return `${pn}-bg-color`;
}
function getTextColorKey(pn) {
  return `${pn}-text-color`;
}
function getReplacementKey(pn) {
  return pn;
}

// inject/domain/gitlab/index.ts
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
  bgColor,
  textColor,
  replacement
}) {
  return `<mark name="${name}" style="background-color: ${bgColor}; color: ${textColor}">${replacement}</mark>`;
}

// inject/domain/regexp/index.ts
function pnRegexp() {
  return /^\s*([pP]\d)\s*[:.]?/;
}
function findPn(text) {
  const match = text.match(pnRegexp());
  return match?.[1]?.toLocaleLowerCase();
}

// inject/index.ts
var pnMap;
function replaceText(replacementMap) {
  const marks = document.querySelectorAll("mark[name]");
  marks.forEach((mark) => {
    if (!(mark instanceof HTMLElement)) return;
    const rule = mark.getAttribute("name")?.toLocaleLowerCase();
    if (!rule) return;
    for (const key of Object.keys(replacementMap)) {
      if (key.startsWith(rule)) {
        const replacement = escapeHtml(replacementMap[key]);
        const bg = replacementMap[`${rule}-bg-color`];
        const color = replacementMap[`${rule}-text-color`];
        mark.textContent = replacement;
        mark.style.backgroundColor = bg;
        mark.style.color = color;
      }
    }
  });
}
function replacePnText(replacementMap) {
  const notes = getNotes();
  notes.forEach((note) => {
    const pn = findPn(note.innerHTML);
    if (pn && pn in replacementMap) {
      const replacementKey = getReplacementKey(pn);
      const bgColorKey = getBgColorKey(pn);
      const textColorKey = getTextColorKey(pn);
      note.innerHTML = note.innerHTML.replace(
        pn,
        genMarker({
          name: pn,
          bgColor: replacementMap[bgColorKey],
          textColor: replacementMap[textColorKey],
          replacement: replacementMap[replacementKey]
        })
      );
    }
  });
}
async function init() {
  if (pnMap == null) pnMap ??= await getAllFromChromeLocalStorage();
  subscribeToChromeStorage((changes) => {
    const tmpMap = {};
    Object.entries(changes).forEach(([key, change]) => {
      pnMap[key] = change.newValue;
      tmpMap[key] = change.newValue;
    });
    replaceText(tmpMap);
  });
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        replacePnText(pnMap);
      }
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
init();
