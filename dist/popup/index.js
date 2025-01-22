"use strict";

// utils/chrome/index.ts
function saveToChromeLocalStorage(map) {
  chrome.storage.local.set(map);
}
function getAllFromChromeLocalStorage() {
  const { promise, resolve } = Promise.withResolvers();
  chrome.storage.local.get((data) => {
    resolve(data);
  });
  return promise;
}
function getBgColorKey(pn) {
  return `${pn}-bg-color`;
}
function getTextColorKey(pn) {
  return `${pn}-text-color`;
}
function getReplacementKey(pn) {
  return pn;
}

// popup/index.ts
var form = document.querySelector("form");
var bgColorInputs = document.querySelectorAll("[name$='-bg-color']");
var textColorInputs = document.querySelectorAll("[name$='-text-color']");
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
      const input2 = e.target;
      const name = input2.name;
      const textInput = document.querySelector(
        `[name='${name.replace("-bg-color", "")}']`
      );
      textInput.style.backgroundColor = input2.value;
    });
  });
  textColorInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const input2 = e.target;
      const name = input2.name;
      const textInput = document.querySelector(
        `[name='${name.replace("-text-color", "")}']`
      );
      textInput.style.color = input2.value;
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
