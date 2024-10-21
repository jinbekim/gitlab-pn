function replacePnText(emojiMap) {
  const notes = document.querySelectorAll("div.note-text.md p");

  notes.forEach((note) => {
    const pnRegex = /^\s*(?<rule>[pP]\d)\s*[:.]/;
    const match = note.textContent.match(pnRegex);
    if (match && match[1] && match[1].toLowerCase() in emojiMap) {
      const emoji = emojiMap[match[1].toLowerCase()];
      note.textContent = note.textContent.replace(pnRegex, `${emoji || "$<rule>"} :`);
    }
  });
}

function init() {
  chrome.storage.local.get().then((data) => {
    replacePnText(data);
  });
}

// MutationObserver to detect when the notes are loaded
new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.type === "childList") {
      init();
    }
  });
}).observe(document.body, {
  childList: true,
  subtree: true,
});

init();
