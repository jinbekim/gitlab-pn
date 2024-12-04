"use strict"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// utils/index.ts
var escapeHtml = (unsafe) => {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
};

// inject/index.ts
var pnMap;
chrome.storage.local.onChanged.addListener((changes) => {
  const tmpMap = {};
  Object.entries(changes).forEach(([key, change]) => {
    pnMap[key] = change.newValue;
    tmpMap[key] = change.newValue;
  });
  debugger;
  replaceText(tmpMap);
});
function replaceText(replacementMap) {
  const marks = document.querySelectorAll("mark[name]");
  marks.forEach((mark) => {
    if (!(mark instanceof HTMLElement)) return;
    const rule = _optionalChain([mark, 'access', _ => _.getAttribute, 'call', _2 => _2("name"), 'optionalAccess', _3 => _3.toLocaleLowerCase, 'call', _4 => _4()]);
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
  const notes = document.querySelectorAll(
    "div.note-body > div.note-text.md [data-sourcepos][dir='auto']"
  );
  notes.forEach((note) => {
    const pnRegex = /^\s*([pP]\d)\s*[:.]?/;
    const match = _optionalChain([note, 'access', _5 => _5.innerHTML, 'optionalAccess', _6 => _6.match, 'call', _7 => _7(pnRegex)]);
    const rule = _optionalChain([match, 'optionalAccess', _8 => _8[1], 'optionalAccess', _9 => _9.toLocaleLowerCase, 'call', _10 => _10()]);
    if (match && rule && rule in replacementMap && note.innerHTML) {
      const replacement = escapeHtml(replacementMap[rule]);
      const bg = replacementMap[`${rule}-bg-color`];
      const color = replacementMap[`${rule}-text-color`];
      note.innerHTML = note.innerHTML.replace(
        pnRegex,
        `<mark name="${rule}" style="background-color: ${bg}; color: ${color}">${replacement}</mark> :`
      );
    }
  });
}
async function init() {
  if (pnMap == null)
    await chrome.storage.local.get().then((data) => {
      pnMap = data;
    });
  return pnMap;
}
new MutationObserver((mutations) => {
  init().then((_map) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        replacePnText(_map);
      }
    });
  });
}).observe(document.body, {
  childList: true,
  subtree: true
});
init();
