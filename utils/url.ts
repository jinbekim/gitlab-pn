export const getSearchParams = (): URLSearchParams => {
  return new URLSearchParams(window.location.search);
};

export const setUrlParams = (params: URLSearchParams) => {
  window.history.pushState({}, "", `${window.location.pathname}?${params.toString()}`);
};
