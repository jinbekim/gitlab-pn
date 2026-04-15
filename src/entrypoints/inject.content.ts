import 'uno.css';
import '../styles/inject.css';
import { pluginManager } from '@core/plugin';
import { PnRulePlugin } from '@plugins/pn-rule';
import { RmMrFilterPlugin } from '@plugins/rm-mr-filter';
import { MrDescViewerPlugin } from '@plugins/mr-desc-viewer';
import { UrgentMrPlugin } from '@plugins/urgent-mr';

export default defineContentScript({
  matches: ['*://*/*/*/-/merge_requests*'],
  runAt: 'document_idle',

  main() {
    pluginManager.register(new PnRulePlugin());
    pluginManager.register(new RmMrFilterPlugin());
    pluginManager.register(new MrDescViewerPlugin());
    pluginManager.register(new UrgentMrPlugin());

    pluginManager.initAll();

    window.addEventListener('beforeunload', () => pluginManager.cleanupAll());
  },
});
