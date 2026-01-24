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
  const siblings = Array.from(li?.parentElement?.children ?? []);

  if (!li || siblings.length === 0) {
    console.warn(`cannot find li or siblings`);
    return;
  }
  const idx = siblings.indexOf(li as Element);
  if (idx === -1) {
    console.warn(`cannot find index of ${li} from ${siblings}`);
    return;
  }
  console.log(`remove filter at index ${idx}`, filterList);
  filterList.splice(idx, 1);
  setFilterList(filterList);
}
