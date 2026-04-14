/**
 * Urgent MR checkbox UI component
 * Renders a checkbox row similar to GitLab's "Mark as draft" checkbox
 */

export function createUrgentCheckbox(
  checked: boolean,
  onChange: (checked: boolean) => void,
): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'urgent-mr-checkbox-wrapper';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'urgent-mr-checkbox';
  checkbox.checked = checked;

  const label = document.createElement('label');
  label.htmlFor = 'urgent-mr-checkbox';
  label.textContent = 'Mark as urgent';

  const helpText = document.createElement('p');
  helpText.className = 'urgent-mr-help-text';
  helpText.textContent = 'Prepends ❗️ to the title to indicate urgency';

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);
  wrapper.appendChild(helpText);

  checkbox.addEventListener('change', () => onChange(checkbox.checked));
  return wrapper;
}

export function setCheckboxState(wrapper: HTMLDivElement, checked: boolean): void {
  const checkbox = wrapper.querySelector<HTMLInputElement>('#urgent-mr-checkbox');
  if (checkbox && checkbox.checked !== checked) {
    checkbox.checked = checked;
  }
}
