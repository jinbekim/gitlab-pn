import { getClickUpPattern, getClickUpTaskUrl } from "@domain/clickup";
import { showModal, hideModal, pinToSidePanel, getModal } from "./ui";

const LINK_CLASS = "clickup-link";
const PROCESSED_ATTR = "data-clickup-processed";

/**
 * Initialize modal with side panel callback
 */
function initModal(): void {
  getModal((taskId) => {
    hideModal();
    pinToSidePanel(taskId);
  });
}

/**
 * Detect and transform ClickUp patterns in the document
 */
export function detectAndTransformClickUpPatterns(): void {
  // Initialize modal with pin callback
  initModal();

  // Find all text nodes in MR notes
  const noteContainers = document.querySelectorAll(
    '.note-body, .md, [data-testid="note-body"]'
  );

  noteContainers.forEach((container) => {
    processContainer(container as HTMLElement);
  });
}

/**
 * Process a container element for ClickUp patterns
 */
function processContainer(container: HTMLElement): void {
  // Skip if already processed
  if (container.getAttribute(PROCESSED_ATTR) === "true") {
    return;
  }

  const pattern = getClickUpPattern();
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null
  );

  const nodesToProcess: { node: Text; matches: RegExpMatchArray[] }[] = [];

  let node: Text | null;
  while ((node = walker.nextNode() as Text)) {
    // Skip nodes inside already created links
    if (node.parentElement?.classList.contains(LINK_CLASS)) {
      continue;
    }

    const text = node.textContent || "";
    pattern.lastIndex = 0;

    const matches: RegExpMatchArray[] = [];
    let match: RegExpExecArray | null;

    while ((match = pattern.exec(text)) !== null) {
      matches.push([...match] as RegExpMatchArray);
    }

    if (matches.length > 0) {
      nodesToProcess.push({ node, matches });
    }
  }

  // Process nodes in reverse order to maintain correct positions
  nodesToProcess.reverse().forEach(({ node, matches }) => {
    transformTextNode(node, matches);
  });

  // Mark container as processed
  container.setAttribute(PROCESSED_ATTR, "true");
}

/**
 * Transform a text node by replacing ClickUp patterns with clickable links
 */
function transformTextNode(node: Text, matches: RegExpMatchArray[]): void {
  const text = node.textContent || "";
  const fragment = document.createDocumentFragment();

  let lastIndex = 0;

  matches.forEach((match) => {
    const fullMatch = match[0];
    const taskId = match[1];
    const matchIndex = text.indexOf(fullMatch, lastIndex);

    // Add text before match
    if (matchIndex > lastIndex) {
      fragment.appendChild(
        document.createTextNode(text.slice(lastIndex, matchIndex))
      );
    }

    // Create clickable link
    const link = createClickUpLink(taskId);
    fragment.appendChild(link);

    lastIndex = matchIndex + fullMatch.length;
  });

  // Add remaining text after last match
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  // Replace original node
  node.parentNode?.replaceChild(fragment, node);
}

/**
 * Create a clickable ClickUp link element
 */
function createClickUpLink(taskId: string): HTMLAnchorElement {
  const link = document.createElement("a");
  link.className = LINK_CLASS;
  link.href = getClickUpTaskUrl(taskId);
  link.textContent = `🔗 CU-${taskId}`;
  link.title = `ClickUp 태스크: ${taskId}`;
  link.setAttribute("data-task-id", taskId);

  // Prevent default navigation and show modal instead
  link.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    showModal(taskId);
  };

  // Allow Ctrl/Cmd+click to open in new tab
  link.onmousedown = (e) => {
    if (e.ctrlKey || e.metaKey) {
      // Allow default behavior for new tab
      link.target = "_blank";
    }
  };

  return link;
}

/**
 * Reset processed state for all containers (useful for re-processing)
 */
export function resetProcessedState(): void {
  const processedElements = document.querySelectorAll(
    `[${PROCESSED_ATTR}="true"]`
  );
  processedElements.forEach((el) => {
    el.removeAttribute(PROCESSED_ATTR);
  });
}
