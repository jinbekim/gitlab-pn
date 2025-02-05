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

// inject/domain/pn/index.ts
function getBgColorKey(pn) {
  return `${pn}-bg-color`.toLocaleLowerCase();
}
function getTextColorKey(pn) {
  return `${pn}-text-color`.toLocaleLowerCase();
}
function getReplacementKey(pn) {
  return pn.toLocaleLowerCase();
}
function isPnRuleMap(map) {
  if (typeof map !== "object" || map === null) return false;
  return ["p1", "p2", "p3"].every((key) => key in map);
}

// popup/index.ts
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
