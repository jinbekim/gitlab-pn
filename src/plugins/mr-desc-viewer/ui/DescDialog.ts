/**
 * <dialog> based side panel for MR description
 */

export function createDescDialog(): HTMLDialogElement {
  const dialog = document.createElement('dialog');
  dialog.className = 'mr-desc-viewer-dialog';
  dialog.innerHTML = `
    <div class="mr-desc-viewer-header">
      <h3 class="mr-desc-viewer-title"></h3>
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
  dialog.show();
}

export function closeDialog(dialog: HTMLDialogElement): void {
  dialog.close();
}

export function setDialogContent(
  dialog: HTMLDialogElement,
  title: string,
  html: string,
): void {
  dialog.querySelector('.mr-desc-viewer-title')!.textContent = title;
  const body = dialog.querySelector('.mr-desc-viewer-body .md')!;
  body.innerHTML = html || '<p><em>No description provided.</em></p>';
}

export function setDialogLoading(dialog: HTMLDialogElement): void {
  dialog.querySelector('.mr-desc-viewer-title')!.textContent = '';
  dialog.querySelector('.mr-desc-viewer-body .md')!.innerHTML =
    '<p class="mr-desc-viewer-loading">Loading…</p>';
}

export function setDialogError(dialog: HTMLDialogElement, message: string): void {
  dialog.querySelector('.mr-desc-viewer-title')!.textContent = 'Error';
  dialog.querySelector('.mr-desc-viewer-body .md')!.innerHTML =
    `<p class="mr-desc-viewer-error">${message}</p>`;
}
