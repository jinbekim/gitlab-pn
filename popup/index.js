var form = document.querySelector("form");
form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(form);
    var map = {};
    formData.forEach(function (value, key) {
        map[key] = value;
    });
    saveEmoji(map);
    window.close();
});
function saveEmoji(emojiMap) {
    chrome.storage.local.set(emojiMap);
}
function getValues() {
    chrome.storage.local.get(["p1", "p2", "p3"]).then(function (data) {
        Object.keys(data).forEach(function (key) {
            var input = document.querySelector("[name='".concat(key, "']"));
            input.value = data[key] || "";
        });
    });
}
getValues();
