import { getAllFromChromeLocalStorage, saveToChromeLocalStorage } from "@utils/chrome";
import { getReplacementKey, getBgColorKey, getTextColorKey, isPnRuleMap, PnRule } from "@domain/pn";

const form = document.querySelector("form");
const bgColorInputs = document.querySelectorAll("[name$='-bg-color']");
const textColorInputs = document.querySelectorAll("[name$='-text-color']");

function getValues() {
  getAllFromChromeLocalStorage().then((data) => {
    if (!isPnRuleMap(data)) return;

    Object.keys(data).forEach((key) => {
      const input = document.querySelector(`[name='${key}']`);
      const pn = key as PnRule;
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
      const input = e.target as HTMLInputElement;
      const name = input.name;
      const textInput = document.querySelector(
        `[name='${name.replace("-bg-color", "")}']`
      ) as HTMLInputElement;
      textInput.style.backgroundColor = input.value;
    });
  });

  textColorInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const input = e.target as HTMLInputElement;
      const name = input.name;
      const textInput = document.querySelector(
        `[name='${name.replace("-text-color", "")}']`
      ) as HTMLInputElement;
      textInput.style.color = input.value;
    });
  });

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const map: { [k: string]: FormDataEntryValue } = {};

    formData.forEach((value, key) => {
      map[key] = value;
    });

    saveToChromeLocalStorage(map);

    window.close();
  });
}

getValues();
init();
