/**
 * RmMrFilter Plugin - Adds delete buttons to MR filter history items
 */

import { BasePlugin, type PluginMeta, type PluginContext } from '@core/plugin';
import { createObserver, disconnectObserver } from '@utils/observer';
import { removeFilterByIndex } from './utils';
import { RemoveButton } from './ui/RemoveButton';

const STORAGE_KEY_ENABLED = 'rm-mr-filter-enabled';
const OBSERVER_ID = 'rm-mr-filter-observer';

export class RmMrFilterPlugin extends BasePlugin {
  readonly meta: PluginMeta = {
    id: 'rm-mr-filter',
    name: 'MR Filter Remover',
    version: '1.0.0',
    enabledKey: STORAGE_KEY_ENABLED,
  };

  private getFilterDropdownButton: typeof import('@services/gitlab').getFilterDropdownButton = () => null;
  private getFilterListItems: typeof import('@services/gitlab').getFilterListItems = () => null;
  private SELECTORS: typeof import('@services/gitlab').SELECTORS = {} as typeof import('@services/gitlab').SELECTORS;

  override async init(context: PluginContext): Promise<void> {
    await super.init(context);

    // Store gitlab accessors
    this.getFilterDropdownButton = context.gitlab.getFilterDropdownButton;
    this.getFilterListItems = context.gitlab.getFilterListItems;
    this.SELECTORS = context.gitlab.SELECTORS;
  }

  override async start(): Promise<void> {
    if (this._state === 'active') return;

    const button = this.getFilterDropdownButton();
    if (!button) {
      // Button not found, but we still mark as started
      // The observer will handle it when the button appears
      await super.start();
      return;
    }

    createObserver({
      id: OBSERVER_ID,
      target: button,
      callback: () => this.addRemoveButtonsToFilters(),
      config: { childList: true, subtree: true },
    });

    this.addRemoveButtonsToFilters();
    await super.start();
  }

  override stop(): void {
    if (this._state !== 'active') return;

    disconnectObserver(OBSERVER_ID);
    super.stop();
  }

  private addRemoveButtonsToFilters(): void {
    const filterList = this.getFilterListItems();

    filterList?.forEach((filter) => {
      if (filter.querySelector(this.SELECTORS.customRemoveButton)) {
        return;
      }

      const removeButton = RemoveButton();
      filter.appendChild(removeButton);

      removeButton.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        removeFilterByIndex(e);
        filter.remove();
      });
    });
  }
}
