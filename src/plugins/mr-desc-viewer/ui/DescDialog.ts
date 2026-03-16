/**
 * <dialog> based side panel for MR description
 */

export function createDescDialog(): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.className = 'mr-desc-viewer-dialog';
  dialog.innerHTML = `
    <div class="mr-desc-viewer-header">
      <h3 class="mr-desc-viewer-title">Overview</h3>
      <button type="button" class="mr-desc-viewer-close" title="Close">&times;</button>
    </div>
    <div class="mr-desc-viewer-body">
      <div class="md"></div>
    </div>
  `;

  dialog.querySelector('.mr-desc-viewer-close')!.addEventListener('click', () => {
    closeDialog(dialog);
  });

  return dialog;
}

export function openDialog(dialog: HTMLDialogElement): void {
  dialog.showModal();
}

export function closeDialog(dialog: HTMLDialogElement): void {
  dialog.close();
}

export function setDialogContent(
  dialog: HTMLDialogElement,
  html: string,
): void {
  const body = dialog.querySelector('.mr-desc-viewer-body .md')!;
  body.innerHTML = html || '<p><em>No description provided.</em></p>';

  // GitLab uses data-src for lazy loading — swap to src so images render
  body.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((img) => {
    img.src = img.dataset.src!;
    img.removeAttribute('data-src');
    img.loading = 'lazy';
  });

  // Also handle video/source with data-src
  body.querySelectorAll<HTMLSourceElement>('source[data-src]').forEach((source) => {
    source.src = source.dataset.src!;
    source.removeAttribute('data-src');
  });
}

export function setDialogLoading(dialog: HTMLDialogElement): void {
  dialog.querySelector('.mr-desc-viewer-body .md')!.innerHTML =
    '<p class="mr-desc-viewer-loading">Loading…</p>';
}

export function setDialogError(dialog: HTMLDialogElement, message: string): void {
  dialog.querySelector('.mr-desc-viewer-body .md')!.innerHTML =
    `<p class="mr-desc-viewer-error">${message}</p>`;
}
