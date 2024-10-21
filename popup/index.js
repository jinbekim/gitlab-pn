const form = document.querySelector("form");

form.addEventListener("submit", (e) => {
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
    Object.keys(data).forEach((key) => {
      const input = document.querySelector(`[name='${key}']`);
      input.value = data[key] || "";
    });
  });
}
getValues();
