import {
  getAllFromChromeLocalStorage,
  getBgColorKey,
  getReplacementKey,
  getTextColorKey,
  isPnRuleMap,
  saveToChromeLocalStorage
} from "../chunk-7NDE5PE2.mjs";

// src/features/popup/index.ts
var form = document.querySelector("form");
var bgColorInputs = document.querySelectorAll("[name$='-bg-color']");
var textColorInputs = document.querySelectorAll("[name$='-text-color']");
var pnRuleToggle = document.getElementById("pn-rule-enabled");
var rmMrFilterToggle = document.getElementById("rm-mr-filter-enabled");
var STORAGE_KEYS = {
  PN_RULE_ENABLED: "pn-rule-enabled",
  RM_MR_FILTER_ENABLED: "rm-mr-filter-enabled"
};
function getValues() {
  getAllFromChromeLocalStorage().then((data) => {
    pnRuleToggle.checked = data[STORAGE_KEYS.PN_RULE_ENABLED] !== false;
    rmMrFilterToggle.checked = data[STORAGE_KEYS.RM_MR_FILTER_ENABLED] !== false;
    if (!isPnRuleMap(data)) return;
    Object.keys(data).forEach((key) => {
      const input = document.querySelector(`[name='${key}']`);
      const pn = key;
      if (input instanceof HTMLInputElement) {
        input.value = data[getReplacementKey(pn)] || pn;
        input.style.backgroundColor = data[getBgColorKey(pn)] || "transparent";
        input.style.color = data[getTextColorKey(pn)] || "black";
      }
    });
  });
}
function init() {
  pnRuleToggle.addEventListener("change", () => {
    saveToChromeLocalStorage({ [STORAGE_KEYS.PN_RULE_ENABLED]: pnRuleToggle.checked });
  });
  rmMrFilterToggle.addEventListener("change", () => {
    saveToChromeLocalStorage({ [STORAGE_KEYS.RM_MR_FILTER_ENABLED]: rmMrFilterToggle.checked });
  });
  bgColorInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const target = e.target;
      const name = target.name;
      const textInput = document.querySelector(
        `[name='${name.replace("-bg-color", "")}']`
      );
      textInput.style.backgroundColor = target.value;
    });
  });
  textColorInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const target = e.target;
      const name = target.name;
      const textInput = document.querySelector(
        `[name='${name.replace("-text-color", "")}']`
      );
      textInput.style.color = target.value;
    });
  });
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const map = {};
    formData.forEach((value, key) => {
      map[key] = value;
    });
    saveToChromeLocalStorage(map);
    window.close();
  });
}
getValues();
init();
//# sourceMappingURL=index.mjs.map