export function RemoveButton() {
  const removeButton = document.createElement('button');
  removeButton.type = 'button';

  removeButton.classList.add('custom-rm-btn');
  removeButton.innerHTML = `
<svg class="s16 close-icon"><use xlink:href="/assets/icons-0b41337f52be73f7bbf9d59b841eb98a6e790dfa1a844644f120a80ce3cc18ba.svg#close"></use></svg>
  `;
  return removeButton;
}
