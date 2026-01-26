import 'virtual:uno.css';
import './index.css';
import { getAllFromChromeLocalStorage, saveToChromeLocalStorage } from "@utils/chrome";
import { getBgColorKey, getTextColorKey, PnRule } from "@domain/pn";
import { PLUGIN_REGISTRY, type PluginInfo } from "@core/plugin";

const form = document.getElementById("form") as HTMLFormElement | null;
const pluginListEl = document.getElementById("plugin-list");
const settingsDisabledEl = document.getElementById("settings-disabled");

// GitLab preset colors
const PRESET_BG_COLORS = [
  '#dc143c', '#ed9121', '#eee600', '#009966',
  '#3cb371', '#6699cc', '#9400d3', '#808080'
];
const PRESET_TEXT_COLORS = ['#ffffff', '#000000'];

const PN_RULES: PnRule[] = ['p1', 'p2', 'p3'];

// Track plugin states
let pluginStates: Record<string, boolean> = {};

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

function initTabs(): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.tab');
  const tabContents = document.querySelectorAll<HTMLElement>('.tab-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.dataset.tab;
      if (!targetId) return;

      // Update tab buttons
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update tab contents
      tabContents.forEach(content => {
        if (content.id === `${targetId}-tab`) {
          content.classList.remove('hidden');
        } else {
          content.classList.add('hidden');
        }
      });
    });
  });
}

function renderPluginToggles(): void {
  if (!pluginListEl) return;

  pluginListEl.innerHTML = '';

  PLUGIN_REGISTRY.forEach((plugin: PluginInfo) => {
    const isEnabled = pluginStates[plugin.enabledKey] ?? true;

    const item = document.createElement('div');
    item.className = 'plugin-item';

    item.innerHTML = `
      <div class="plugin-info">
        <span class="plugin-name">${plugin.name}</span>
        <span class="plugin-description">${plugin.description}</span>
      </div>
      <label class="toggle-switch">
        <input type="checkbox" data-plugin-key="${plugin.enabledKey}" ${isEnabled ? 'checked' : ''}>
        <span class="toggle-slider"></span>
      </label>
    `;

    pluginListEl.appendChild(item);
  });

  // Add event listeners to toggles
  pluginListEl.querySelectorAll<HTMLInputElement>('input[data-plugin-key]').forEach(input => {
    input.addEventListener('change', () => handleToggleChange(input));
  });
}

async function handleToggleChange(input: HTMLInputElement): Promise<void> {
  const key = input.dataset.pluginKey;
  if (!key) return;

  const isEnabled = input.checked;
  pluginStates[key] = isEnabled;

  await saveToChromeLocalStorage({ [key]: isEnabled });
  updateSettingsVisibility();
}

function updateSettingsVisibility(): void {
  const pnRuleEnabled = pluginStates['pn-rule-enabled'] ?? true;

  if (settingsDisabledEl && form) {
    if (pnRuleEnabled) {
      settingsDisabledEl.classList.add('hidden');
      form.classList.remove('hidden');
    } else {
      settingsDisabledEl.classList.remove('hidden');
      form.classList.add('hidden');
    }
  }
}

async function loadValues(): Promise<void> {
  const data = await getAllFromChromeLocalStorage();

  // Load plugin states
  PLUGIN_REGISTRY.forEach(plugin => {
    pluginStates[plugin.enabledKey] = data[plugin.enabledKey] !== false;
  });

  // Load color values
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

  renderPluginToggles();
  updateSettingsVisibility();
  initPalettes();
}

function initForm(): void {
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

function init(): void {
  initTabs();
  initForm();
  loadValues();
}

init();
