var pnRules = { p1: "필수", p2: "적극 고려", p3: "의견, 제안" };
var form = document.querySelector("form");
form === null || form === void 0 ? void 0 : form.addEventListener("submit", function (e) {
    e.preventDefault();
    var formData = new FormData(form);
    var data = Object.fromEntries(formData);
    saveEmoji(data);
    window.close();
});
function saveEmoji(emojiMap) {
    chrome.storage.local.set(emojiMap);
}
function getValues() {
    chrome.storage.local.get().then(function (data) {
        Object.entries(pnRules).forEach(function (_a) {
            var name = _a[0];
            var input = document.querySelector("[name='".concat(name, "']"));
            input.value = data[name] || "";
        });
    });
}
function generateLabeledInput(name, label, desc) {
    var input = document.createElement("input");
    input.type = "text";
    input.name = name;
    input.autocomplete = "off";
    input.placeholder = "대치어 입력";
    input.setAttribute("list", "emoji-list");
    var labelElement = document.createElement("label");
    labelElement.textContent = label + ": " + desc;
    labelElement.appendChild(input);
    return labelElement;
}
function appendPnInputs() {
    Object.entries(pnRules).forEach(function (_a) {
        var name = _a[0], desc = _a[1];
        form === null || form === void 0 ? void 0 : form.appendChild(generateLabeledInput(name, name, desc));
    });
}
appendPnInputs();
getValues();
