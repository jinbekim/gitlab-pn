import {
  getAllFromChromeLocalStorage,
  getBgColorKey,
  getReplacementKey,
  getTextColorKey,
  subscribeToChromeStorage,
} from "@utils/chrome";
import { getNotes } from "inject/domain/gitlab";
import { escapeHtml } from "@utils/html";
import { genMarker } from "./domain/html";
import { findPn } from "inject/domain/regexp";

let pnMap: {
  [k: string]: any;
};

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
          replacement: replacementMap[replacementKey],
        })
      );
    }
  });
}


async function init() {
  if (pnMap == null) pnMap ??= await getAllFromChromeLocalStorage();

  subscribeToChromeStorage((changes) => {
    const tmpMap: Record<string, string> = {};
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
