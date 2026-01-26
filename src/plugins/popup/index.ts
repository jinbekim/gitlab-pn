import 'virtual:uno.css';
import './index.css';
import { getAllFromChromeLocalStorage, saveToChromeLocalStorage } from "@utils/chrome";
import { getBgColorKey, getTextColorKey, PnRule } from "@domain/pn";

const form = document.querySelector("form");

// GitLab preset colors
const PRESET_BG_COLORS = [
  '#dc143c', '#ed9121', '#eee600', '#009966',
  '#3cb371', '#6699cc', '#9400d3', '#808080'
];
const PRESET_TEXT_COLORS = ['#ffffff', '#000000'];

const PN_RULES: PnRule[] = ['p1', 'p2', 'p3'];

function renderColorPalette(
  container: Element,
  colors: string[],
  hiddenInput: HTMLInputElement,
  onSelect: () => void
): void {
  container.innerHTML = '';
  const currentValue = hiddenInput.value.toLowerCase();

  colors.forEach(color => {
    const swatch = document.createElement('div');
    swatch.className = 'color-swatch';
    if (color.toLowerCase() === currentValue) {
      swatch.classList.add('selected');
    }
    swatch.style.backgroundColor = color;
    swatch.addEventListener('click', () => {
      container.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
      swatch.classList.add('selected');
      hiddenInput.value = color;
      onSelect();
    });
    container.appendChild(swatch);
  });
}

function updateBadgePreview(pn: PnRule): void {
  const badge = document.getElementById(`${pn}-badge`);
  const bgInput = document.querySelector(`[name="${pn}-bg-color"]`) as HTMLInputElement;
  const textInput = document.querySelector(`[name="${pn}-text-color"]`) as HTMLInputElement;

  if (badge && bgInput && textInput) {
    badge.style.backgroundColor = bgInput.value;
    badge.style.color = textInput.value;
  }
}

function initPalettes(): void {
  PN_RULES.forEach(pn => {
    const bgPalette = document.querySelector(`[data-target="${pn}-bg-color"]`);
    const textPalette = document.querySelector(`[data-target="${pn}-text-color"]`);
    const bgInput = document.querySelector(`[name="${pn}-bg-color"]`) as HTMLInputElement;
    const textInput = document.querySelector(`[name="${pn}-text-color"]`) as HTMLInputElement;

    if (bgPalette && bgInput) {
      renderColorPalette(bgPalette, PRESET_BG_COLORS, bgInput, () => updateBadgePreview(pn));
    }
    if (textPalette && textInput) {
      renderColorPalette(textPalette, PRESET_TEXT_COLORS, textInput, () => updateBadgePreview(pn));
    }

    updateBadgePreview(pn);
  });
}

function loadValues(): void {
  getAllFromChromeLocalStorage().then((data) => {
    PN_RULES.forEach(pn => {
      const bgInput = document.querySelector(`[name="${pn}-bg-color"]`) as HTMLInputElement;
      const textInput = document.querySelector(`[name="${pn}-text-color"]`) as HTMLInputElement;

      if (bgInput && data[getBgColorKey(pn)]) {
        bgInput.value = data[getBgColorKey(pn)] as string;
      }
      if (textInput && data[getTextColorKey(pn)]) {
        textInput.value = data[getTextColorKey(pn)] as string;
      }
    });

    initPalettes();
  });
}

function init(): void {
  form?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const map: Record<string, FormDataEntryValue> = {};

    formData.forEach((value, key) => {
      map[key] = value;
    });

    await saveToChromeLocalStorage(map);
    window.close();
  });
}

loadValues();
init();
