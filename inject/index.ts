import { genMarker } from "@domain/html";
import {
  findPn,
  getBgColorKey,
  getReplacementKey,
  getTextColorKey,
  isPnRule,
  isPnRuleMap,
  PnRuleMapWithColor,
  PnRuleSub,
} from "@domain/pn";
import { getAllFromChromeLocalStorage, subscribeToChromeStorage } from "@utils/chrome";
import { debounce } from "@utils/debounce";
import { escapeHtml } from "@utils/html";
import { getNotes } from "@services/gitlab";

function replaceText(replacementMap: { [k: string]: any }) {
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

function replacePnText(replacementMap: PnRuleMapWithColor) {
  const notes = getNotes();

  notes.forEach((note) => {
    const pn = findPn(note.innerHTML);

    if (pn && pn.toLowerCase() in replacementMap) {
      const replacementKey = getReplacementKey(pn as PnRuleSub);
      const bgColorKey = getBgColorKey(pn as PnRuleSub);
      const textColorKey = getTextColorKey(pn as PnRuleSub);

      note.innerHTML = note.innerHTML.replace(
        pn,
        genMarker({
          name: pn,
          bgColor: replacementMap[bgColorKey],
          textColor: replacementMap[textColorKey],
          replacement: escapeHtml(replacementMap[replacementKey]),
        })
      );
    }
  });
}

async function init() {
  const pnMap = await getAllFromChromeLocalStorage();

  subscribeToChromeStorage((changes) => {
    const tmpMap: Record<string, string> = {};
    Object.entries(changes).forEach(([key, change]) => {
      pnMap[key] = change.newValue;
      tmpMap[key] = change.newValue;
    });
    replaceText(tmpMap);
  });

  const observer = new MutationObserver(
    debounce((mutations: MutationRecord[]) => {
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
