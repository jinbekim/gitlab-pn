const PIN_FILLED = `<svg class="s16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5a.5.5 0 0 1-1 0V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354z"/></svg>`;

const PIN_OUTLINE = `<svg class="s16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M4.146.146A.5.5 0 0 1 4.5 0h7a.5.5 0 0 1 .5.5c0 .68-.342 1.174-.646 1.479-.126.125-.25.224-.354.298v4.431l.078.048c.203.127.476.314.751.555C12.36 7.775 13 8.527 13 9.5a.5.5 0 0 1-.5.5h-4v4.5a.5.5 0 0 1-1 0V10h-4a.5.5 0 0 1-.5-.5c0-.973.64-1.725 1.17-2.189A5.921 5.921 0 0 1 5 6.708V2.277a2.77 2.77 0 0 1-.354-.298C4.342 1.674 4 1.179 4 .5a.5.5 0 0 1 .146-.354zM5 .5c0 .262.12.442.354.672.076.076.164.15.264.222h4.764c.1-.072.188-.146.264-.222C10.88.942 11 .762 11 .5H5zm-.5 6.5h7c-.32-.467-.774-.844-1.17-1.129A4.948 4.948 0 0 0 9.5 5.25V2h-3v3.25c0 .156-.078.304-.211.398a4.948 4.948 0 0 0-.83.621C5.073 6.656 4.82 7.033 4.5 7.5z"/></svg>`;

export function PinButton(pinned: boolean): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('custom-pin-btn');
  if (pinned) button.classList.add('pinned');
  button.innerHTML = pinned ? PIN_FILLED : PIN_OUTLINE;
  button.title = pinned ? 'Unpin search' : 'Pin search';
  return button;
}

export function updatePinButtonState(button: HTMLButtonElement, pinned: boolean): void {
  button.classList.toggle('pinned', pinned);
  button.innerHTML = pinned ? PIN_FILLED : PIN_OUTLINE;
  button.title = pinned ? 'Unpin search' : 'Pin search';
}
