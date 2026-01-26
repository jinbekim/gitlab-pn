import { genMarker } from "@domain/html";
import {
  findPn,
  getBgColorKey,
  getReplacementKey,
  getTextColorKey,
  isPnRule,
  PnRuleMapWithColor,
  PnRuleSub,
} from "@domain/pn";
import { getNotes } from "@services/gitlab";
import { escapeHtml } from "@utils/html";

/**
 * Updates existing mark elements with new replacement values
 */
export function replaceText(replacementMap: Record<string, string>): void {
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

/**
 * Replaces Pn prefixes in notes with styled markers
 */
export function replacePnText(replacementMap: PnRuleMapWithColor): void {
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
