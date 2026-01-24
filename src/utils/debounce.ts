export function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  return function (this: any, ...args: any[]) {
    const later = () => {
      timeout = undefined;
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
