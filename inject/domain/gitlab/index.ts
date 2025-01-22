export function getNotes() {
  return document.querySelectorAll("div.note-body > div.note-text.md [data-sourcepos][dir='auto']");
}
