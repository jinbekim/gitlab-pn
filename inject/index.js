var defaultEmoji = { p1: "❗️", p2: "🤔", p3: "📝" };
function replacePnText(emojiMap) {
  const notes = document.querySelectorAll("div.note-text.md p");

  notes.forEach((note) => {
    const pnRegex = /^\s*([pP]\d)\s*[:.]/;
    const match = note.textContent.match(pnRegex);
    if (match && match[1] && match[1].toLowerCase() in emojiMap) {
      const emoji = emojiMap[match[1].toLowerCase()];
      note.textContent = note.textContent.replace(
        pnRegex,
        `${emoji || defaultEmoji[match[1].toLowerCase()]} :`
      );
    }
  });
}
function init() {
  chrome.storage.local.get().then(function (data) {
    replacePnText(data);
  });
}
// MutationObserver to detect when the notes are loaded
new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    console.log("mutation", mutation);
    if (mutation.type === "childList") {
      init();
    }
  });
}).observe(document.body, {
  childList: true,
  subtree: true,
});
init();
