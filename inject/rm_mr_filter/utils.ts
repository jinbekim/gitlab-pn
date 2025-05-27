// interface Filter {
//   type: string;
//   value: {
//     data: string;
//     operator: string;
//   };
//   id: string;
// }

// type FilterList = Filter[][];

type FilterList = string[];

export function getKey() {
  const url = new URL(window.location.href);
  const pathname = url.pathname;
  const [project] = pathname.split("/-/");
  return `${project.slice(1)}-merge-request-recent-searches`;
}

export function getFilterList() {
  const key = getKey();
  const value = localStorage.getItem(key);
  if (!value) return [];
  return JSON.parse(value) as FilterList;
}

export function setFilterList(filterList: FilterList) {
  const key = getKey();
  localStorage.setItem(key, JSON.stringify(filterList));
}

export function removeFilterByIndex(e: MouseEvent) {
  const filterList = getFilterList();
  const li = (e.target as HTMLButtonElement).parentElement?.parentElement;
  const siblings = li?.parentElement?.children;

  if (!li || !siblings || siblings.length === 0) {
    return;
  }
  const idx = Array.from(siblings).indexOf(li as Element);
  if (idx === -1) {
    return;
  }
  filterList.splice(idx, 1);
  setFilterList(filterList);
}
