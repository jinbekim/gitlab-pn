export default defineContentScript({
  matches: ['*://*/*/*/-/merge_requests*'],
  runAt: 'document_start',
  world: 'MAIN',

  main() {
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
  },
});
