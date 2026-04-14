/**
 * Urgent MR checkbox UI component
 * Uses GitLab's native checkbox structure for visual consistency with "Mark as draft"
 */

export function createUrgentCheckbox(
  checked: boolean,
  onChange: (checked: boolean) => void,
): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className = 'gl-form-checkbox custom-control custom-checkbox gl-mt-3';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = 'urgent-mr-checkbox';
  checkbox.className = 'custom-control-input';
  checkbox.checked = checked;

  const label = document.createElement('label');
  label.className = 'custom-control-label';
  label.htmlFor = 'urgent-mr-checkbox';
  label.innerHTML =
    '<span>Mark as urgent</span>' +
    '<p class="help-text">Prepends ❗️ to the title to indicate urgency</p>';

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);

  checkbox.addEventListener('change', () => onChange(checkbox.checked));
  return wrapper;
}

export function setCheckboxState(wrapper: HTMLDivElement, checked: boolean): void {
  const checkbox = wrapper.querySelector<HTMLInputElement>('#urgent-mr-checkbox');
  if (checkbox && checkbox.checked !== checked) {
    checkbox.checked = checked;
  }
}
