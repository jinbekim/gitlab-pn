"use strict";
function saveEmoji(emojiMap) {
    chrome.storage.local.set(emojiMap);
}
const form = document.querySelector("form");
form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const map = {};
    formData.forEach((value, key) => {
        map[key] = value;
    });
    saveEmoji(map);
    window.close();
});
const bgColorInputs = document.querySelectorAll("[name$='-bg-color']");
const textColorInputs = document.querySelectorAll("[name$='-text-color']");
bgColorInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        const input = e.target;
        const name = input.name;
        const textInput = document.querySelector(`[name='${name.replace("-bg-color", "")}']`);
        textInput.style.backgroundColor = input.value;
    });
});
textColorInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
        const input = e.target;
        const name = input.name;
        const textInput = document.querySelector(`[name='${name.replace("-text-color", "")}']`);
        textInput.style.color = input.value;
    });
});
function getValues() {
    chrome.storage.local.get().then((data) => {
        Object.keys(data).forEach((key) => {
            const input = document.querySelector(`[name='${key}']`);
            if (input instanceof HTMLInputElement) {
                input.value = data[key] || key;
                input.style.backgroundColor = data[`${key}-bg-color`];
                input.style.color = data[`${key}-text-color`];
            }
        });
    });
}
getValues();
