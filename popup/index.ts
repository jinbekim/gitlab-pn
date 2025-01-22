import {
  getAllFromChromeLocalStorage,
  getBgColorKey,
  getReplacementKey,
  getTextColorKey,
  saveToChromeLocalStorage,
} from "@utils/chrome";

const form = document.querySelector("form");
const bgColorInputs = document.querySelectorAll("[name$='-bg-color']");
const textColorInputs = document.querySelectorAll("[name$='-text-color']");

function getValues() {
  getAllFromChromeLocalStorage().then((data) => {
    Object.keys(data).forEach((key) => {
      const input = document.querySelector(`[name='${key}']`);

      if (input instanceof HTMLInputElement) {
        input.value = data[getReplacementKey(key)] || key;
        input.style.backgroundColor = data[getBgColorKey(key)];
        input.style.color = data[getTextColorKey(key)];
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
