/**
 * Toggle button for MR Description Viewer
 */

const DOC_ICON_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 1h6l4 4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" stroke="currentColor" stroke-width="1.5" fill="none"/>
  <path d="M10 1v4h4" stroke="currentColor" stroke-width="1.5" fill="none"/>
  <line x1="5.5" y1="8" x2="10.5" y2="8" stroke="currentColor" stroke-width="1.5"/>
  <line x1="5.5" y1="11" x2="10.5" y2="11" stroke="currentColor" stroke-width="1.5"/>
</svg>`;

export function createToggleButton(onClick: () => void): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'mr-desc-viewer-toggle';
  button.title = 'MR Description';
  button.innerHTML = DOC_ICON_SVG;
  button.addEventListener('click', onClick);
  return button;
}
