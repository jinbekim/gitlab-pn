/**
 * PnRule Plugin - Replaces priority labels (P1, P2, P3) with styled markers
 */

import { BasePlugin, type PluginMeta, type StorageChanges, type PluginContext } from '@core/plugin';
import { DEFAULT_PN_RULE_MAP, type PnRuleMapWithColor } from '@domain/pn';
import { createPnRuleObserver, disconnectPnRuleObserver } from './observer';
import { replaceText } from './replacer';

const STORAGE_KEY_ENABLED = 'pn-rule-enabled';

export class PnRulePlugin extends BasePlugin {
  readonly meta: PluginMeta = {
    id: 'pn-rule',
    name: 'Priority Label Replacer',
    version: '1.0.0',
    enabledKey: STORAGE_KEY_ENABLED,
  };

  private pnMap: PnRuleMapWithColor = { ...DEFAULT_PN_RULE_MAP };

  override async init(context: PluginContext): Promise<void> {
    await super.init(context);

    // Load initial pn map from storage
    const data = await context.storage.getAll();
    this.pnMap = {
      ...DEFAULT_PN_RULE_MAP,
      ...data,
    } as PnRuleMapWithColor;
  }

  override async start(): Promise<void> {
    if (this._state === 'active') return;

    createPnRuleObserver(this.pnMap);
    await super.start();
  }

  override stop(): void {
    if (this._state !== 'active') return;

    disconnectPnRuleObserver();
    super.stop();
  }

  override onStorageChange(changes: StorageChanges): void {
    // Skip if it's just the enabled state change (handled by PluginManager)
    if (Object.keys(changes).length === 1 && this.meta.enabledKey in changes) {
      return;
    }

    // Update pnMap with changes
    const tmpMap: Record<string, string> = {};
    Object.entries(changes).forEach(([key, change]) => {
      if (key !== this.meta.enabledKey) {
        (this.pnMap as Record<string, unknown>)[key] = change.newValue;
        tmpMap[key] = change.newValue;
      }
    });

    // If active, apply changes immediately
    if (this._state === 'active' && Object.keys(tmpMap).length > 0) {
      replaceText(tmpMap);
    }
  }
}
