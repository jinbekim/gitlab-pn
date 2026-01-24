// src/utils/chrome/index.ts
function saveToChromeLocalStorage(map) {
  return new Promise((resolve) => {
    try {
      chrome.storage.local.set(map, () => {
        if (chrome.runtime.lastError) {
          resolve({
            success: false,
            error: new Error(chrome.runtime.lastError.message)
          });
        } else {
          resolve({ success: true, data: void 0 });
        }
      });
    } catch (error) {
      resolve({
        success: false,
        error: error instanceof Error ? error : new Error(String(error))
      });
    }
  });
}
function getAllFromChromeLocalStorage() {
  return new Promise((resolve, reject) => {
    try {
      chrome.storage.local.get((data) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(data);
        }
      });
    } catch (error) {
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

// src/domain/pn/index.ts
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

// src/features/popup/index.ts
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
      const target = e.target;
      const name = target.name;
      const textInput = document.querySelector(
        `[name='${name.replace("-bg-color", "")}']`
      );
      textInput.style.backgroundColor = target.value;
    });
  });
  textColorInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const target = e.target;
      const name = target.name;
      const textInput = document.querySelector(
        `[name='${name.replace("-text-color", "")}']`
      );
      textInput.style.color = target.value;
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
//# sourceMappingURL=index.mjs.map