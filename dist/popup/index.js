"use strict"; function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }// popup/index.ts
function saveEmoji(emojiMap) {
  chrome.storage.local.set(emojiMap);
}
var form = document.querySelector("form");
_optionalChain([form, 'optionalAccess', _ => _.addEventListener, 'call', _2 => _2("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const map = {};
  formData.forEach((value, key) => {
    map[key] = value;
  });
  saveEmoji(map);
  window.close();
})]);
var bgColorInputs = document.querySelectorAll("[name$='-bg-color']");
var textColorInputs = document.querySelectorAll("[name$='-text-color']");
bgColorInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    const input2 = e.target;
    const name = input2.name;
    const textInput = document.querySelector(`[name='${name.replace("-bg-color", "")}']`);
    textInput.style.backgroundColor = input2.value;
  });
});
textColorInputs.forEach((input) => {
  input.addEventListener("input", (e) => {
    const input2 = e.target;
    const name = input2.name;
    const textInput = document.querySelector(`[name='${name.replace("-text-color", "")}']`);
    textInput.style.color = input2.value;
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
