const form = document.querySelector("form");

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const map: {
    [k: string]: any;
  } = {};
  formData.forEach((value, key) => {
    map[key] = value;
  });
  saveEmoji(map);
  window.close();
});
function saveEmoji(emojiMap: {
  [k: string]: any;
}) {
  chrome.storage.local.set(emojiMap);
}
function getValues() {
  chrome.storage.local.get(["p1", "p2", "p3"]).then((data) => {
    Object.keys(data).forEach((key) => {
      const input = document.querySelector(`[name='${key}']`) as HTMLInputElement;
      input.value = data[key] || "";
    });
  });
}
getValues();
