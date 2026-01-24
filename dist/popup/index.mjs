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
function getValues() {
  getAllFromChromeLocalStorage().then((data) => {
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