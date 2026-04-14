/**
 * Urgent MR Toggle Plugin
 * Adds a "Mark as urgent" checkbox on MR edit/new pages
 * that prepends ❗️ to the title
 */

import { BasePlugin, type PluginMeta } from '@core/plugin';
import { createObserver, disconnectObserver } from '@utils/observer';
import { getMrTitleInput, SELECTORS } from '@services/gitlab';
import { isMrFormPage } from './url';
import { createUrgentCheckbox, setCheckboxState } from './ui/UrgentCheckbox';

const TITLE_OBSERVER_ID = 'urgent-mr-title-observer';
const INPUT_OBSERVER_ID = 'urgent-mr-input-observer';
const URGENT_PREFIX = '❗️ ';
const URGENT_PREFIX_NO_SPACE = '❗️';

function hasUrgentPrefix(value: string): boolean {
  return value.startsWith(URGENT_PREFIX) || value.startsWith(URGENT_PREFIX_NO_SPACE);
}

function stripUrgentPrefix(value: string): string {
  if (value.startsWith(URGENT_PREFIX)) return value.slice(URGENT_PREFIX.length);
  if (value.startsWith(URGENT_PREFIX_NO_SPACE)) return value.slice(URGENT_PREFIX_NO_SPACE.length).trimStart();
  return value;
}

export class UrgentMrPlugin extends BasePlugin {
  readonly meta: PluginMeta = {
    id: 'urgent-mr',
    name: 'Urgent MR Toggle',
    version: '1.0.0',
    enabledKey: 'urgent-mr-enabled',
  };

  private checkboxWrapper: HTMLDivElement | null = null;
  private inputHandler: (() => void) | null = null;
  private lastUrl = '';
  private popstateHandler: (() => void) | null = null;
  private navEventHandler: (() => void) | null = null;

  override async start(): Promise<void> {
    if (this._state === 'active') return;

    this.handleUrlChange();
    this.setupNavigationListeners();

    await super.start();
  }

  override stop(): void {
    if (this._state !== 'active') return;

    disconnectObserver(TITLE_OBSERVER_ID);
    disconnectObserver(INPUT_OBSERVER_ID);

    if (this.popstateHandler) {
      window.removeEventListener('popstate', this.popstateHandler);
      this.popstateHandler = null;
    }
    if (this.navEventHandler) {
      window.removeEventListener('__mr_desc_nav__', this.navEventHandler);
      this.navEventHandler = null;
    }

    this.removeUI();
    this.lastUrl = '';

    super.stop();
  }

  private setupNavigationListeners(): void {
    const onNav = () => this.handleUrlChange();

    const titleEl = document.querySelector('title');
    if (titleEl) {
      createObserver({
        id: TITLE_OBSERVER_ID,
        target: titleEl,
        callback: onNav,
        config: { childList: true },
      });
    }

    this.popstateHandler = onNav;
    window.addEventListener('popstate', this.popstateHandler);

    this.navEventHandler = onNav;
    window.addEventListener('__mr_desc_nav__', this.navEventHandler);
  }

  private handleUrlChange(): void {
    const currentUrl = location.pathname;
    if (currentUrl === this.lastUrl) return;
    this.lastUrl = currentUrl;

    if (isMrFormPage()) {
      this.ensureUI();
    } else {
      this.removeUI();
    }
  }

  private ensureUI(): void {
    if (this.checkboxWrapper) return;

    const input = getMrTitleInput();
    if (input) {
      this.injectCheckbox(input);
    } else {
      this.waitForInput();
    }
  }

  private waitForInput(): void {
    createObserver({
      id: INPUT_OBSERVER_ID,
      target: document.body,
      callback: () => {
        const input = getMrTitleInput();
        if (input) {
          disconnectObserver(INPUT_OBSERVER_ID);
          this.injectCheckbox(input);
        }
      },
      config: { childList: true, subtree: true },
    });
  }

  private injectCheckbox(input: HTMLInputElement): void {
    if (this.checkboxWrapper) return;

    const initialChecked = hasUrgentPrefix(input.value);
    this.checkboxWrapper = createUrgentCheckbox(initialChecked, (checked) =>
      this.onCheckboxChange(checked),
    );

    // Insert after "Mark as draft" checkbox area, or after the title form group
    const draftCheckbox = document.querySelector(SELECTORS.mrDraftCheckbox);
    const insertTarget = draftCheckbox?.closest('.form-group, .gl-form-group, [class*="form-group"]')
      ?? input.closest('.form-group, .gl-form-group, [class*="form-group"]');

    if (insertTarget) {
      insertTarget.after(this.checkboxWrapper);
    } else {
      input.parentElement?.appendChild(this.checkboxWrapper);
    }

    // Sync checkbox state when user manually edits the title
    this.inputHandler = () => {
      if (this.checkboxWrapper) {
        setCheckboxState(this.checkboxWrapper, hasUrgentPrefix(input.value));
      }
    };
    input.addEventListener('input', this.inputHandler);
  }

  private onCheckboxChange(checked: boolean): void {
    const input = getMrTitleInput();
    if (!input) return;

    if (checked) {
      if (!hasUrgentPrefix(input.value)) {
        input.value = URGENT_PREFIX + input.value;
      }
    } else {
      input.value = stripUrgentPrefix(input.value);
    }

    // Dispatch input event so GitLab's form logic recognizes the change
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  private removeUI(): void {
    if (this.checkboxWrapper) {
      const input = getMrTitleInput();
      if (input && this.inputHandler) {
        input.removeEventListener('input', this.inputHandler);
      }
      this.inputHandler = null;
      this.checkboxWrapper.remove();
      this.checkboxWrapper = null;
    }
    disconnectObserver(INPUT_OBSERVER_ID);
  }
}
