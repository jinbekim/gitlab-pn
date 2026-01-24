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
function pnRegexp() {
  return /^([pP]\d)\s*[:.]?/;
}
function findPn(text) {
  const match = text.match(pnRegexp());
  return match?.[1];
}
function isPnRule(rule = "") {
  return pnRegexp().test(rule);
}
function isPnRuleMap(map) {
  if (typeof map !== "object" || map === null) return false;
  return ["p1", "p2", "p3"].every((key) => key in map);
}

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
function subscribeToChromeStorage(callback) {
  chrome.storage.onChanged.addListener(callback);
  return () => {
    chrome.storage.onChanged.removeListener(callback);
  };
}

export {
  getBgColorKey,
  getTextColorKey,
  getReplacementKey,
  findPn,
  isPnRule,
  isPnRuleMap,
  saveToChromeLocalStorage,
  getAllFromChromeLocalStorage,
  subscribeToChromeStorage
};
//# sourceMappingURL=chunk-7NDE5PE2.mjs.map