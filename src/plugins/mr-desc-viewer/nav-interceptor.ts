/**
 * Injected into MAIN world to intercept history.pushState/replaceState
 * and dispatch a custom event for the content script to detect SPA navigation.
 */

const EVENT_NAME = '__mr_desc_nav__';

const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function (...args: Parameters<typeof history.pushState>) {
  originalPushState.apply(this, args);
  window.dispatchEvent(new Event(EVENT_NAME));
};

history.replaceState = function (...args: Parameters<typeof history.replaceState>) {
  originalReplaceState.apply(this, args);
  window.dispatchEvent(new Event(EVENT_NAME));
};
