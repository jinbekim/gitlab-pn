import { getAllFromChromeLocalStorage, saveToChromeLocalStorage } from "@utils/chrome";
import { getReplacementKey, getBgColorKey, getTextColorKey, isPnRuleMap, PnRule } from "@domain/pn";

const form = document.querySelector("form");
const bgColorInputs = document.querySelectorAll("[name$='-bg-color']");
const textColorInputs = document.querySelectorAll("[name$='-text-color']");
const pnRuleToggle = document.getElementById("pn-rule-enabled") as HTMLInputElement;
const rmMrFilterToggle = document.getElementById("rm-mr-filter-enabled") as HTMLInputElement;

const STORAGE_KEYS = {
  PN_RULE_ENABLED: "pn-rule-enabled",
  RM_MR_FILTER_ENABLED: "rm-mr-filter-enabled",
} as const;

function getValues(): void {
  getAllFromChromeLocalStorage().then((data) => {
    // Load toggle states (default to true if not set)
    pnRuleToggle.checked = data[STORAGE_KEYS.PN_RULE_ENABLED] !== false;
    rmMrFilterToggle.checked = data[STORAGE_KEYS.RM_MR_FILTER_ENABLED] !== false;

    if (!isPnRuleMap(data)) return;

    Object.keys(data).forEach((key) => {
      const input = document.querySelector(`[name='${key}']`);
      const pn = key as PnRule;
      if (input instanceof HTMLInputElement) {
        input.value = data[getReplacementKey(pn)] as string || pn;
        input.style.backgroundColor = data[getBgColorKey(pn)] as string || "transparent";
        input.style.color = data[getTextColorKey(pn)] as string || "black";
      }
    });
  });
}

function init(): void {
  // Toggle event listeners
  pnRuleToggle.addEventListener("change", () => {
    saveToChromeLocalStorage({ [STORAGE_KEYS.PN_RULE_ENABLED]: pnRuleToggle.checked });
  });

  rmMrFilterToggle.addEventListener("change", () => {
    saveToChromeLocalStorage({ [STORAGE_KEYS.RM_MR_FILTER_ENABLED]: rmMrFilterToggle.checked });
  });

  bgColorInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const name = target.name;
      const textInput = document.querySelector(
        `[name='${name.replace("-bg-color", "")}']`
      ) as HTMLInputElement;
      textInput.style.backgroundColor = target.value;
    });
  });

  textColorInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const name = target.name;
      const textInput = document.querySelector(
        `[name='${name.replace("-text-color", "")}']`
      ) as HTMLInputElement;
      textInput.style.color = target.value;
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const map: Record<string, FormDataEntryValue> = {};

    formData.forEach((value, key) => {
      map[key] = value;
    });

    saveToChromeLocalStorage(map);

    window.close();
  });
}

getValues();
init();
