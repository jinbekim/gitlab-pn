/**
 * PinMrFilter Plugin - Adds pin buttons to MR filter history items
 */

import { BasePlugin, type PluginMeta, type PluginContext } from '@core/plugin';
import { createObserver, disconnectObserver } from '@utils/observer';
import { getPinnedList, togglePin } from '@plugins/rm-mr-filter/pinStorage';
import { PinButton, updatePinButtonState } from './ui/PinButton';

const STORAGE_KEY_ENABLED = 'pin-mr-filter-enabled';
const OBSERVER_ID = 'pin-mr-filter-observer';
const FILTER_DONE_EVENT = '__rm_filter_done__';

export class PinMrFilterPlugin extends BasePlugin {
  readonly meta: PluginMeta = {
    id: 'pin-mr-filter',
    name: 'MR Filter Pinner',
    version: '1.0.0',
    enabledKey: STORAGE_KEY_ENABLED,
  };

  private getFilterDropdownButton: typeof import('@services/gitlab').getFilterDropdownButton =
    () => null;
  private getFilterDropdown: typeof import('@services/gitlab').getFilterDropdown = () => null;
  private getFilterListItems: typeof import('@services/gitlab').getFilterListItems = () => null;
  private SELECTORS: typeof import('@services/gitlab').SELECTORS =
    {} as typeof import('@services/gitlab').SELECTORS;

  private processing = false;

  override async init(context: PluginContext): Promise<void> {
    await super.init(context);

    this.getFilterDropdownButton = context.gitlab.getFilterDropdownButton;
    this.getFilterDropdown = context.gitlab.getFilterDropdown;
    this.getFilterListItems = context.gitlab.getFilterListItems;
    this.SELECTORS = context.gitlab.SELECTORS;
  }

  override async start(): Promise<void> {
    if (this._state === 'active') return;

    const button = this.getFilterDropdownButton();
    if (!button) {
      await super.start();
      return;
    }

    createObserver({
      id: OBSERVER_ID,
      target: button,
      callback: () => this.processPins(),
      config: { childList: true, subtree: true },
    });

    this.processPins();
    window.addEventListener('message', this.handleFilterDone);
    await super.start();
  }

  override stop(): void {
    if (this._state !== 'active') return;

    window.removeEventListener('message', this.handleFilterDone);
    disconnectObserver(OBSERVER_ID);
    this.cleanupInjectedItems();
    super.stop();
  }

  private handleFilterDone = (e: MessageEvent) => {
    if (e.data?.type === FILTER_DONE_EVENT) {
      this.processPins();
    }
  };

  private processPins(): void {
    if (this.processing) return;
    this.processing = true;
    try {
      const pinned = getPinnedList();
      this.injectMissingPinnedItems(pinned);
      this.addPinButtons(pinned);
      this.applyVisualOrder(pinned);
    } finally {
      this.processing = false;
    }
  }

  private getItemText(item: Element): string {
    const btn = item.querySelector('button.filtered-search-history-dropdown-item');
    return btn?.textContent?.trim() ?? '';
  }

  private injectMissingPinnedItems(pinned: string[]): void {
    const dropdown = this.getFilterDropdown();
    if (!dropdown) return;

    const existingItems = this.getFilterListItems();
    if (!existingItems || existingItems.length === 0) return;

    const existingTexts = new Set<string>();
    existingItems.forEach((item) => existingTexts.add(this.getItemText(item)));

    const container = existingItems[0].parentElement;
    if (!container) return;

    const clearItem = container.querySelector('li.gl-text-subtle');

    for (const pinnedText of pinned) {
      if (existingTexts.has(pinnedText)) continue;

      const li = document.createElement('li');
      li.setAttribute('data-testid', 'dropdown-item');
      li.classList.add('custom-pinned-injected');

      const btn = document.createElement('button');
      btn.className = 'filtered-search-history-dropdown-item js-dropdown-button';
      btn.textContent = pinnedText;
      btn.type = 'button';

      li.appendChild(btn);

      if (clearItem) {
        container.insertBefore(li, clearItem);
      } else {
        container.appendChild(li);
      }
    }
  }

  private addPinButtons(pinned: string[]): void {
    const dropdown = this.getFilterDropdown();
    if (!dropdown) return;

    const items = dropdown.querySelectorAll(this.SELECTORS.filterListItem);
    if (!items) return;

    const pinnedSet = new Set(pinned);

    items.forEach((item) => {
      const text = this.getItemText(item);
      const isPinned = pinnedSet.has(text);

      const existingBtn = item.querySelector(
        this.SELECTORS.customPinButton,
      ) as HTMLButtonElement | null;
      if (existingBtn) {
        updatePinButtonState(existingBtn, isPinned);
        item.classList.toggle('is-pinned', isPinned);
        return;
      }

      const pinButton = PinButton(isPinned);
      item.appendChild(pinButton);
      item.classList.toggle('is-pinned', isPinned);

      pinButton.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        togglePin(text);
        this.processPins();
      });
    });
  }

  private applyVisualOrder(pinned: string[]): void {
    const dropdown = this.getFilterDropdown();
    if (!dropdown) return;

    const items = dropdown.querySelectorAll(this.SELECTORS.filterListItem);
    if (!items || items.length === 0) return;

    const pinnedSet = new Set(pinned);

    items.forEach((item) => {
      const text = this.getItemText(item);
      (item as HTMLElement).style.order = pinnedSet.has(text) ? '-1' : '';
    });

    // Ensure flex layout on the container for CSS order to work
    const container = items[0].parentElement as HTMLElement | null;
    if (container) {
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
    }
  }

  private cleanupInjectedItems(): void {
    document
      .querySelectorAll(this.SELECTORS.customPinnedInjected)
      .forEach((el) => el.remove());
  }
}
