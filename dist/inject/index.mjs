import {
  findPn,
  getAllFromChromeLocalStorage,
  getBgColorKey,
  getReplacementKey,
  getTextColorKey,
  isPnRule,
  isPnRuleMap,
  subscribeToChromeStorage
} from "../chunk-7NDE5PE2.mjs";

// src/utils/observer/index.ts
var observers = /* @__PURE__ */ new Map();
var defaultConfig = {
  childList: true,
  subtree: true
};
function createObserver(options) {
  const { id, target, callback, config = defaultConfig } = options;
  if (observers.has(id)) {
    disconnectObserver(id);
  }
  const observer = new MutationObserver(callback);
  observer.observe(target, config);
  observers.set(id, { observer, target });
  return observer;
}
function disconnectObserver(id) {
  const entry = observers.get(id);
  if (entry) {
    entry.observer.disconnect();
    observers.delete(id);
    return true;
  }
  return false;
}

// src/utils/debounce.ts
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const later = () => {
      timeout = void 0;
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// src/domain/html/index.ts
function genMarker({
  name,
  replacement,
  bgColor,
  textColor
}) {
  return `<mark name="${name}" style="background-color: ${bgColor}; color: ${textColor}">${replacement}</mark>`;
}

// src/services/gitlab/selectors.ts
var SELECTORS = {
  // Note elements in MR discussion
  notes: "div.note-body > div.note-text.md [data-sourcepos][dir='auto']",
  // Filter dropdown elements
  filterDropdown: "div.filtered-search-history-dropdown",
  filterDropdownButton: "button.filtered-search-history-dropdown-toggle-button",
  filterListItem: 'li[data-testid="dropdown-item"]:not(.gl-text-subtle)',
  // Custom remove button class
  customRemoveButton: ".custom-rm-btn"
};

// src/services/gitlab/index.ts
function getNotes() {
  return document.querySelectorAll(SELECTORS.notes);
}
function getFilterDropdown() {
  return document.querySelector(SELECTORS.filterDropdown);
}
function getFilterDropdownButton() {
  return document.querySelector(SELECTORS.filterDropdownButton);
}
function getFilterListItems() {
  const dropdown = getFilterDropdown();
  if (!dropdown) return null;
  return dropdown.querySelectorAll(SELECTORS.filterListItem);
}

// src/utils/html/index.ts
function escapeHtml(unsafe) {
  return unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

// src/features/pn-rule/replacer.ts
function replaceText(replacementMap) {
  const marks = document.querySelectorAll("mark[name]");
  marks.forEach((mark) => {
    if (!(mark instanceof HTMLElement)) return;
    const rule = mark.getAttribute("name")?.toLocaleLowerCase();
    if (!isPnRule(rule)) return;
    for (const key of Object.keys(replacementMap)) {
      if (key.startsWith(rule)) {
        const replacementKey = getReplacementKey(rule);
        const bgColorKey = getBgColorKey(rule);
        const textColorKey = getTextColorKey(rule);
        if (replacementMap[replacementKey]) {
          mark.textContent = escapeHtml(replacementMap[replacementKey]);
        }
        if (replacementMap[bgColorKey]) {
          mark.style.backgroundColor = replacementMap[bgColorKey];
        }
        if (replacementMap[textColorKey]) {
          mark.style.color = replacementMap[textColorKey];
        }
      }
    }
  });
}
function replacePnText(replacementMap) {
  const notes = getNotes();
  notes.forEach((note) => {
    const pn = findPn(note.innerHTML);
    if (pn && pn.toLowerCase() in replacementMap) {
      const replacementKey = getReplacementKey(pn);
      const bgColorKey = getBgColorKey(pn);
      const textColorKey = getTextColorKey(pn);
      note.innerHTML = note.innerHTML.replace(
        pn,
        genMarker({
          name: pn,
          bgColor: replacementMap[bgColorKey],
          textColor: replacementMap[textColorKey],
          replacement: escapeHtml(replacementMap[replacementKey])
        })
      );
    }
  });
}

// src/features/pn-rule/observer.ts
var OBSERVER_ID = "pn-rule-observer";
function createPnRuleObserver(pnMap) {
  const debouncedCallback = debounce((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList" && isPnRuleMap(pnMap)) {
        replacePnText(pnMap);
      }
    });
  }, 20);
  createObserver({
    id: OBSERVER_ID,
    target: document.body,
    callback: debouncedCallback,
    config: { childList: true, subtree: true }
  });
}
function disconnectPnRuleObserver() {
  disconnectObserver(OBSERVER_ID);
}

// src/features/pn-rule/index.ts
var unsubscribeStorage = null;
async function initPnRule() {
  const pnMap = await getAllFromChromeLocalStorage();
  unsubscribeStorage = subscribeToChromeStorage((changes) => {
    const tmpMap = {};
    Object.entries(changes).forEach(([key, change]) => {
      pnMap[key] = change.newValue;
      tmpMap[key] = change.newValue;
    });
    replaceText(tmpMap);
  });
  if (isPnRuleMap(pnMap)) {
    createPnRuleObserver(pnMap);
  }
}
function cleanupPnRule() {
  if (unsubscribeStorage) {
    unsubscribeStorage();
    unsubscribeStorage = null;
  }
  disconnectPnRuleObserver();
}

// src/features/rm-mr-filter/utils.ts
function getKey() {
  const url = new URL(window.location.href);
  const pathname = url.pathname;
  const [project] = pathname.split("/-/");
  return `${project.slice(1)}-merge-request-recent-searches`;
}
function getFilterList() {
  const key = getKey();
  const value = localStorage.getItem(key);
  if (!value) return [];
  return JSON.parse(value);
}
function setFilterList(filterList) {
  const key = getKey();
  localStorage.setItem(key, JSON.stringify(filterList));
}
function removeFilterByIndex(e) {
  const filterList = getFilterList();
  const li = e.target.parentElement?.parentElement;
  const siblings = Array.from(li?.parentElement?.children ?? []);
  if (!li || siblings.length === 0) {
    console.warn(`cannot find li or siblings`);
    return;
  }
  const idx = siblings.indexOf(li);
  if (idx === -1) {
    console.warn(`cannot find index of ${li} from ${siblings}`);
    return;
  }
  console.log(`remove filter at index ${idx}`, filterList);
  filterList.splice(idx, 1);
  setFilterList(filterList);
}

// src/features/rm-mr-filter/ui/RemoveButton.ts
function RemoveButton() {
  const removeButton = document.createElement("button");
  removeButton.type = "button";
  removeButton.classList.add("custom-rm-btn");
  removeButton.innerHTML = `
<svg class="s16 close-icon"><use xlink:href="/assets/icons-0b41337f52be73f7bbf9d59b841eb98a6e790dfa1a844644f120a80ce3cc18ba.svg#close"></use></svg>
  `;
  return removeButton;
}

// src/features/rm-mr-filter/index.ts
var OBSERVER_ID2 = "rm-mr-filter-observer";
function addRemoveButtonsToFilters() {
  const filterList = getFilterListItems();
  filterList?.forEach((filter) => {
    if (filter.querySelector(SELECTORS.customRemoveButton)) {
      return;
    }
    const removeButton = RemoveButton();
    filter.appendChild(removeButton);
    removeButton.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      removeFilterByIndex(e);
      filter.remove();
    });
  });
}
function initRmMrFilter() {
  const button = getFilterDropdownButton();
  if (!button) return;
  createObserver({
    id: OBSERVER_ID2,
    target: button,
    callback: addRemoveButtonsToFilters,
    config: { childList: true, subtree: true }
  });
  addRemoveButtonsToFilters();
}
function cleanupRmMrFilter() {
  disconnectObserver(OBSERVER_ID2);
}

// src/domain/clickup/index.ts
var CLICKUP_PATTERN = /\{\{clickup:([a-zA-Z0-9]+)\}\}/g;
var CLICKUP_BASE_URL = "https://app.clickup.com/t";
function getClickUpTaskUrl(taskId) {
  return `${CLICKUP_BASE_URL}/${taskId}`;
}
function getClickUpPattern() {
  return new RegExp(CLICKUP_PATTERN.source, "g");
}

// src/features/clickup-content/ui/Modal.ts
var MODAL_OVERLAY_CLASS = "clickup-modal-overlay";
var MODAL_CLASS = "clickup-modal";
var MODAL_HEADER_CLASS = "clickup-modal-header";
var MODAL_IFRAME_CLASS = "clickup-modal-iframe";
var MODAL_LOADING_CLASS = "clickup-modal-loading";
var Modal = class {
  overlay = null;
  currentTaskId = null;
  onPinToSidePanel = null;
  constructor(onPinToSidePanel) {
    this.onPinToSidePanel = onPinToSidePanel || null;
  }
  getIframeSrc(taskId) {
    return getClickUpTaskUrl(taskId);
  }
  isVisible() {
    return this.overlay !== null && this.overlay.style.display !== "none";
  }
  getCurrentTaskId() {
    return this.currentTaskId;
  }
  show(taskId) {
    this.currentTaskId = taskId;
    if (!this.overlay) {
      this.createModal();
    }
    const iframe = this.overlay?.querySelector(
      `.${MODAL_IFRAME_CLASS}`
    );
    const loading = this.overlay?.querySelector(
      `.${MODAL_LOADING_CLASS}`
    );
    if (iframe) {
      if (loading) {
        loading.style.display = "flex";
      }
      iframe.style.display = "none";
      iframe.src = this.getIframeSrc(taskId);
      iframe.onload = () => {
        if (loading) {
          loading.style.display = "none";
        }
        iframe.style.display = "block";
      };
      iframe.onerror = () => {
        if (loading) {
          loading.textContent = "\uB85C\uB4DC \uC2E4\uD328";
        }
      };
    }
    if (this.overlay) {
      this.overlay.style.display = "flex";
    }
    document.body.style.overflow = "hidden";
  }
  hide() {
    if (this.overlay) {
      this.overlay.style.display = "none";
      const iframe = this.overlay.querySelector(
        `.${MODAL_IFRAME_CLASS}`
      );
      if (iframe) {
        iframe.src = "about:blank";
      }
    }
    this.currentTaskId = null;
    document.body.style.overflow = "";
  }
  destroy() {
    this.hide();
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
  }
  createModal() {
    this.overlay = document.createElement("div");
    this.overlay.className = MODAL_OVERLAY_CLASS;
    const modal = document.createElement("div");
    modal.className = MODAL_CLASS;
    const header = document.createElement("div");
    header.className = MODAL_HEADER_CLASS;
    const closeBtn = document.createElement("button");
    closeBtn.className = "clickup-modal-close";
    closeBtn.innerHTML = "\u2715";
    closeBtn.title = "\uB2EB\uAE30";
    closeBtn.onclick = () => this.hide();
    const title = document.createElement("span");
    title.className = "clickup-modal-title";
    title.textContent = "ClickUp";
    const actions = document.createElement("div");
    actions.className = "clickup-modal-actions";
    const newTabBtn = document.createElement("button");
    newTabBtn.className = "clickup-modal-btn";
    newTabBtn.innerHTML = "\u{1F517} \uC0C8 \uD0ED\uC5D0\uC11C \uC5F4\uAE30";
    newTabBtn.onclick = () => {
      if (this.currentTaskId) {
        window.open(this.getIframeSrc(this.currentTaskId), "_blank");
      }
    };
    const pinBtn = document.createElement("button");
    pinBtn.className = "clickup-modal-btn clickup-modal-btn-primary";
    pinBtn.innerHTML = "\u{1F4CC} \uC0AC\uC774\uB4DC\uBC14\uB85C \uACE0\uC815";
    pinBtn.onclick = () => {
      if (this.currentTaskId && this.onPinToSidePanel) {
        this.onPinToSidePanel(this.currentTaskId);
      }
    };
    actions.appendChild(newTabBtn);
    actions.appendChild(pinBtn);
    header.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(actions);
    const loading = document.createElement("div");
    loading.className = MODAL_LOADING_CLASS;
    loading.textContent = "\uB85C\uB529 \uC911...";
    const iframe = document.createElement("iframe");
    iframe.className = MODAL_IFRAME_CLASS;
    iframe.setAttribute("allow", "clipboard-read; clipboard-write");
    iframe.style.display = "none";
    modal.appendChild(header);
    modal.appendChild(loading);
    modal.appendChild(iframe);
    this.overlay.appendChild(modal);
    this.overlay.onclick = (e) => {
      if (e.target === this.overlay) {
        this.hide();
      }
    };
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isVisible()) {
        this.hide();
      }
    });
    document.body.appendChild(this.overlay);
  }
};
var modalInstance = null;
function getModal(onPinToSidePanel) {
  if (!modalInstance) {
    modalInstance = new Modal(onPinToSidePanel);
  }
  return modalInstance;
}
function showModal(taskId) {
  getModal().show(taskId);
}
function hideModal() {
  getModal().hide();
}
function destroyModal() {
  if (modalInstance) {
    modalInstance.destroy();
    modalInstance = null;
  }
}

// src/features/clickup-content/ui/SidePanel.ts
var SIDE_PANEL_CLASS = "clickup-side-panel";
var SIDE_PANEL_HEADER_CLASS = "clickup-side-panel-header";
var SIDE_PANEL_IFRAME_CLASS = "clickup-side-panel-iframe";
var SIDE_PANEL_LOADING_CLASS = "clickup-side-panel-loading";
var SidePanel = class {
  panel = null;
  currentTaskId = null;
  getIframeSrc(taskId) {
    return getClickUpTaskUrl(taskId);
  }
  isVisible() {
    return this.panel !== null && this.panel.classList.contains("visible");
  }
  getCurrentTaskId() {
    return this.currentTaskId;
  }
  show(taskId) {
    this.currentTaskId = taskId;
    if (!this.panel) {
      this.createPanel();
    }
    const iframe = this.panel?.querySelector(
      `.${SIDE_PANEL_IFRAME_CLASS}`
    );
    const loading = this.panel?.querySelector(
      `.${SIDE_PANEL_LOADING_CLASS}`
    );
    if (iframe) {
      if (loading) {
        loading.style.display = "flex";
      }
      iframe.style.display = "none";
      iframe.src = this.getIframeSrc(taskId);
      iframe.onload = () => {
        if (loading) {
          loading.style.display = "none";
        }
        iframe.style.display = "block";
      };
      iframe.onerror = () => {
        if (loading) {
          loading.textContent = "\uB85C\uB4DC \uC2E4\uD328";
        }
      };
    }
    if (this.panel) {
      this.panel.classList.add("visible");
    }
    this.adjustMainContent(true);
  }
  hide() {
    if (this.panel) {
      this.panel.classList.remove("visible");
      const iframe = this.panel.querySelector(
        `.${SIDE_PANEL_IFRAME_CLASS}`
      );
      if (iframe) {
        iframe.src = "about:blank";
      }
    }
    this.currentTaskId = null;
    this.adjustMainContent(false);
  }
  destroy() {
    this.hide();
    if (this.panel) {
      this.panel.remove();
      this.panel = null;
    }
  }
  createPanel() {
    this.panel = document.createElement("div");
    this.panel.className = SIDE_PANEL_CLASS;
    const header = document.createElement("div");
    header.className = SIDE_PANEL_HEADER_CLASS;
    const closeBtn = document.createElement("button");
    closeBtn.className = "clickup-side-panel-close";
    closeBtn.innerHTML = "\u2715";
    closeBtn.title = "\uB2EB\uAE30";
    closeBtn.onclick = () => this.hide();
    const title = document.createElement("span");
    title.className = "clickup-side-panel-title";
    title.textContent = "ClickUp";
    const newTabBtn = document.createElement("button");
    newTabBtn.className = "clickup-side-panel-btn";
    newTabBtn.innerHTML = "\u{1F517}";
    newTabBtn.title = "\uC0C8 \uD0ED\uC5D0\uC11C \uC5F4\uAE30";
    newTabBtn.onclick = () => {
      if (this.currentTaskId) {
        window.open(this.getIframeSrc(this.currentTaskId), "_blank");
      }
    };
    header.appendChild(closeBtn);
    header.appendChild(title);
    header.appendChild(newTabBtn);
    const loading = document.createElement("div");
    loading.className = SIDE_PANEL_LOADING_CLASS;
    loading.textContent = "\uB85C\uB529 \uC911...";
    const iframe = document.createElement("iframe");
    iframe.className = SIDE_PANEL_IFRAME_CLASS;
    iframe.setAttribute("allow", "clipboard-read; clipboard-write");
    iframe.style.display = "none";
    this.panel.appendChild(header);
    this.panel.appendChild(loading);
    this.panel.appendChild(iframe);
    document.body.appendChild(this.panel);
  }
  /**
   * Adjust main content to make room for side panel
   */
  adjustMainContent(showPanel) {
    const mainContent = document.querySelector(
      ".content-wrapper, .layout-page, main"
    );
    if (mainContent) {
      if (showPanel) {
        mainContent.style.marginRight = "400px";
        mainContent.style.transition = "margin-right 0.3s ease";
      } else {
        mainContent.style.marginRight = "";
      }
    }
  }
};
var sidePanelInstance = null;
function getSidePanel() {
  if (!sidePanelInstance) {
    sidePanelInstance = new SidePanel();
  }
  return sidePanelInstance;
}
function pinToSidePanel(taskId) {
  getSidePanel().show(taskId);
}
function destroySidePanel() {
  if (sidePanelInstance) {
    sidePanelInstance.destroy();
    sidePanelInstance = null;
  }
}

// src/features/clickup-content/detector.ts
var LINK_CLASS = "clickup-link";
var PROCESSED_ATTR = "data-clickup-processed";
function initModal() {
  getModal((taskId) => {
    hideModal();
    pinToSidePanel(taskId);
  });
}
function detectAndTransformClickUpPatterns() {
  initModal();
  const noteContainers = document.querySelectorAll(
    '.note-body, .md, [data-testid="note-body"]'
  );
  noteContainers.forEach((container) => {
    processContainer(container);
  });
}
function processContainer(container) {
  if (container.getAttribute(PROCESSED_ATTR) === "true") {
    return;
  }
  const pattern = getClickUpPattern();
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );
  const nodesToProcess = [];
  let node;
  while (node = walker.nextNode()) {
    if (node.parentElement?.classList.contains(LINK_CLASS)) {
      continue;
    }
    const text = node.textContent || "";
    pattern.lastIndex = 0;
    const matches = [];
    let match;
    while ((match = pattern.exec(text)) !== null) {
      matches.push([...match]);
    }
    if (matches.length > 0) {
      nodesToProcess.push({ node, matches });
    }
  }
  nodesToProcess.reverse().forEach(({ node: node2, matches }) => {
    transformTextNode(node2, matches);
  });
  container.setAttribute(PROCESSED_ATTR, "true");
}
function transformTextNode(node, matches) {
  const text = node.textContent || "";
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  matches.forEach((match) => {
    const fullMatch = match[0];
    const taskId = match[1];
    const matchIndex = text.indexOf(fullMatch, lastIndex);
    if (matchIndex > lastIndex) {
      fragment.appendChild(
        document.createTextNode(text.slice(lastIndex, matchIndex))
      );
    }
    const link = createClickUpLink(taskId);
    fragment.appendChild(link);
    lastIndex = matchIndex + fullMatch.length;
  });
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }
  node.parentNode?.replaceChild(fragment, node);
}
function createClickUpLink(taskId) {
  const link = document.createElement("a");
  link.className = LINK_CLASS;
  link.href = getClickUpTaskUrl(taskId);
  link.textContent = `\u{1F517} CU-${taskId}`;
  link.title = `ClickUp \uD0DC\uC2A4\uD06C: ${taskId}`;
  link.setAttribute("data-task-id", taskId);
  link.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    showModal(taskId);
  };
  link.onmousedown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      link.target = "_blank";
    }
  };
  return link;
}
function resetProcessedState() {
  const processedElements = document.querySelectorAll(
    `[${PROCESSED_ATTR}="true"]`
  );
  processedElements.forEach((el) => {
    el.removeAttribute(PROCESSED_ATTR);
  });
}

// src/features/clickup-content/observer.ts
var OBSERVER_ID3 = "clickup-content-observer";
function createClickUpContentObserver() {
  const debouncedCallback = debounce(() => {
    detectAndTransformClickUpPatterns();
  }, 100);
  createObserver({
    id: OBSERVER_ID3,
    target: document.body,
    callback: debouncedCallback,
    config: { childList: true, subtree: true }
  });
}
function disconnectClickUpContentObserver() {
  disconnectObserver(OBSERVER_ID3);
}

// src/features/clickup-content/index.ts
function initClickUpContent() {
  detectAndTransformClickUpPatterns();
  createClickUpContentObserver();
}
function cleanupClickUpContent() {
  disconnectClickUpContentObserver();
  resetProcessedState();
  destroyModal();
  destroySidePanel();
}

// src/features/inject/index.ts
async function init() {
  await initPnRule();
  initRmMrFilter();
  initClickUpContent();
}
function cleanup() {
  cleanupPnRule();
  cleanupRmMrFilter();
  cleanupClickUpContent();
}
init();
window.addEventListener("beforeunload", cleanup);
//# sourceMappingURL=index.mjs.map