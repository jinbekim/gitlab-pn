export function saveToChromeLocalStorage(map: { [k: string]: any }) {
  chrome.storage.local.set(map);
}

export function getAllFromChromeLocalStorage() {
  const { promise, resolve } = Promise.withResolvers<{ [k: string]: any }>();

  chrome.storage.local.get((data) => {
    resolve(data);
  });

  return promise;
}

export function subscribeToChromeStorage(
  callback: (changes: { [k: string]: chrome.storage.StorageChange }) => void
) {
  chrome.storage.onChanged.addListener(callback);
}
