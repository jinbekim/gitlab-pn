const pnRules = { p1: "필수", p2: "적극 고려", p3: "의견, 제안" };

const form = document.querySelector("form");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  saveEmoji(data);
  window.close();
});

function saveEmoji(emojiMap) {
  chrome.storage.local.set(emojiMap);
}

function getValues() {
  chrome.storage.local.get().then((data) => {
    Object.entries(pnRules).forEach(([name]) => {
      const input = document.querySelector(`[name='${name}']`);
      input.value = data[name] || "";
    });
  });
}

function generateLabeledInput(name, label, desc) {
  const input = document.createElement("input");
  input.type = "text";
  input.name = name;
  input.autocomplete = "off";
  input.placeholder = "대치어 입력";
  input.setAttribute("list", "emoji-list");

  const labelElement = document.createElement("label");
  labelElement.textContent = label + ": " + desc;
  labelElement.appendChild(input);

  return labelElement;
}
function appendPnInputs() {
  Object.entries(pnRules).forEach(([name, desc]) => {
    form?.appendChild(generateLabeledInput(name, name, desc));
  });
}

appendPnInputs();
getValues();
