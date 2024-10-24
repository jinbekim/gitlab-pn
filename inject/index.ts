let pnMap : {
  [k: string]: any;
};

chrome.storage.local.onChanged.addListener((changes) => {
  const map = Object.entries(changes).reduce((acc, [key, { newValue, oldValue }]) => {
    pnMap[key] = newValue || key;
    return {
      ...acc,
      [oldValue || key]: newValue || key,
    };
  }, {});

  replaceText(map);
  replacePnText(pnMap);
});

function replaceText(replacementMap: {
  [k: string]: any;
}) {
  const notes = document.querySelectorAll(".discussion-body div.note-body > div.note-text.md [data-sourcepos][dir='auto']");

  notes.forEach((note) => {
    Object.keys(replacementMap).some((key) => {
      const pnRegex = new RegExp(`(?<rule>${key}) [:]`);
      const match = note.textContent?.match(pnRegex);
      if (match && match[1] && note.textContent) {
      const replacement = replacementMap[match[1]];
        note.textContent = note.textContent?.replace(pnRegex, `${replacement || "$<rule>"} :`);
      }
      return match;
    });
  });
}

function replacePnText(replacementMap: {
  [k: string]: any;
}) {
  const notes = document.querySelectorAll(".discussion-body div.note-body > div.note-text.md [data-sourcepos][dir='auto']");

  notes.forEach((note) => {
    const pnRegex = /\s*(?<rule>[pP]\d)\s*[:.]?/;
    const match = note.textContent?.match(pnRegex);
    if (match && match[1] && match[1].toLowerCase() in replacementMap && note.textContent) {
      const replacement = replacementMap[match[1].toLowerCase()];
      note.textContent = note.textContent.replace(pnRegex, `${replacement || "$<rule>"} :`);
    }
  });
}

async function init() {
  if (pnMap == null)
    await chrome.storage.local.get(["p1", "p2", "p3"]).then((data) => {
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
