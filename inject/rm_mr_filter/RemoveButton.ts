export function RemoveButton() {
  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.classList.add('custom-rm-btn', 'show-on-focus-or-hover--target', 'transition-opacity-on-hover--target', 'always-animate', 'gl-absolute', 'gl-right-3', 'gl-top-1/2', '-gl-translate-y-1/2', 'btn-default', 'btn-sm', 'gl-button', 'btn-default-tertiary', 'btn-icon');
  removeButton.innerHTML = `
    <svg data-testid="close-icon" role="img" aria-hidden="true" class="gl-button-icon gl-icon s16 gl-fill-current">
      <use href="/assets/icons-1dc8580f14b5de4dcf11c6c7326e55d1b3fb7c05afa8655c3f51c47ac154a434.svg#close"></use>
    </svg>
  `;
  return removeButton;
}
