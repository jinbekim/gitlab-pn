let pnMap: {
  [k: string]: any;
};

const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

chrome.storage.local.onChanged.addListener((changes) => {
  const tmpMap: Record<string, string> = {};
  Object.entries(changes).forEach(([key, change]) => {
    pnMap[key] = change.newValue;
    tmpMap[key] = change.newValue;
  });

  debugger;

  replaceText(tmpMap);
});

function replaceText(replacementMap: { [k: string]: any }) {
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

function replacePnText(replacementMap: { [k: string]: any }) {
  const notes = document.querySelectorAll(
    "div.note-body > div.note-text.md [data-sourcepos][dir='auto']"
  );

  notes.forEach((note) => {
    const pnRegex = /^\s*([pP]\d)\s*[:.]?/;
    const match = note.innerHTML?.match(pnRegex);
    const rule = match?.[1]?.toLocaleLowerCase();

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
  subtree: true,
});
init();
