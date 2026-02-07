import type { DeenruvUIPluginManifestItem } from './types';
import { UIPlugin as DashboardWidgetsPlugin } from '@deenruv/dashboard-widgets-plugin/plugin-ui';

/**
 * Central manifest of all available admin UI plugins.
 *
 * Each entry declares:
 * - `id`               — unique string used in `VITE_ADMIN_UI_PLUGINS` env var
 * - `plugin`           — the actual plugin instance (lazy-import recommended for optional plugins)
 * - `enabledByDefault` — whether the plugin loads when the env var is **unset**
 *
 * ### Adding a new plugin
 * 1. Install the package in `apps/panel/package.json`.
 * 2. Import its UI plugin export at the top of this file.
 * 3. Add an entry to `pluginManifest` with a unique `id`.
 *
 * ### Toggling plugins at build time
 * Set `VITE_ADMIN_UI_PLUGINS` (see `enabled.ts` for semantics):
 *   - *unset*       → `enabledByDefault` entries only
 *   - `""`          → no plugins
 *   - `"all"` / `"*"` → every manifest entry
 *   - CSV list      → only listed IDs (unknown IDs are warned)
 *
 * ### Installed plugin packages with UI extensions
 * The following plugins are installed as dependencies in `apps/panel/package.json`
 * and expose a `./plugin-ui` entry point. Uncomment the import and manifest entry
 * when you want to activate them.
 *
 * | Package                               | Import path                                          | Suggested ID        |
 * | ------------------------------------- | ---------------------------------------------------- | ------------------- |
 * | `@deenruv/merchant-plugin`            | `@deenruv/merchant-plugin/plugin-ui`                 | `merchant`          |
 * | `@deenruv/product-badges-plugin`      | `@deenruv/product-badges-plugin/plugin-ui`           | `badges`            |
 * | `@deenruv/deenruv-examples-plugin`    | `@deenruv/deenruv-examples-plugin/plugin-ui`         | `examples`          |
 * | `@deenruv/copy-order-plugin`          | `@deenruv/copy-order-plugin/plugin-ui`               | `copy-order`        |
 * | `@deenruv/in-realization-plugin`      | `@deenruv/in-realization-plugin/plugin-ui`           | `in-realization`    |
 * | `@deenruv/order-line-attributes-plugin`| `@deenruv/order-line-attributes-plugin/plugin-ui`   | `order-line-attrs`  |
 * | `@deenruv/replicate-plugin`           | `@deenruv/replicate-plugin/plugin-ui`                | `replicate`         |
 * | `@deenruv/replicate-simple-bg-plugin` | `@deenruv/replicate-simple-bg-plugin/plugin-ui`      | `replicate-bg`      |
 * | `@deenruv/przelewy24-plugin`          | `@deenruv/przelewy24-plugin/plugin-ui`               | `przelewy24`        |
 * | `@deenruv/facet-harmonica-plugin`     | `@deenruv/facet-harmonica-plugin/plugin-ui`          | `facet-harmonica`   |
 * | `@deenruv/wfirma-plugin`              | `@deenruv/wfirma-plugin/plugin-ui`                   | `wfirma`            |
 * | `@deenruv/inpost-plugin`              | `@deenruv/inpost-plugin/plugin-ui`                   | `inpost`            |
 */

// ── Active imports ──────────────────────────────────────────────────────
// import { MerchantPluginUI }            from '@deenruv/merchant-plugin/plugin-ui';
// import { BadgesUiPlugin }              from '@deenruv/product-badges-plugin/plugin-ui';
// import { UIPlugin as ExamplesPlugin }  from '@deenruv/deenruv-examples-plugin/plugin-ui';
// import { UIPlugin as CopyOrderPlugin } from '@deenruv/copy-order-plugin/plugin-ui';
// import { InRealizationUIPlugin }       from '@deenruv/in-realization-plugin/plugin-ui';
// import { OrderLineAttributesUiPlugin } from '@deenruv/order-line-attributes-plugin/plugin-ui';
// import { ReplicateUiPlugin }           from '@deenruv/replicate-plugin/plugin-ui';
// import { ReplicateSimpleBGUiPlugin }   from '@deenruv/replicate-simple-bg-plugin/plugin-ui';
// import { CardMarketUIPlugin as Przelewy24UIPlugin } from '@deenruv/przelewy24-plugin/plugin-ui';
// import { FacetHarmonicaUiPlugin }      from '@deenruv/facet-harmonica-plugin/plugin-ui';
// import { WFirmaUIPlugin }              from '@deenruv/wfirma-plugin/plugin-ui';
// import { InPostUIPlugin }              from '@deenruv/inpost-plugin/plugin-ui';

export const pluginManifest: ReadonlyArray<DeenruvUIPluginManifestItem> = [
  {
    id: 'dashboard-widgets',
    plugin: DashboardWidgetsPlugin,
    enabledByDefault: true,
  },
  // ──────────────────────────────────────────────────────────
  // Uncomment the import above AND the entry below to activate:
  //
  // { id: 'merchant',          plugin: MerchantPluginUI,           enabledByDefault: false },
  // { id: 'badges',            plugin: BadgesUiPlugin,             enabledByDefault: false },
  // { id: 'examples',          plugin: ExamplesPlugin,             enabledByDefault: false },
  // { id: 'copy-order',        plugin: CopyOrderPlugin,            enabledByDefault: false },
  // { id: 'in-realization',    plugin: InRealizationUIPlugin,      enabledByDefault: false },
  // { id: 'order-line-attrs',  plugin: OrderLineAttributesUiPlugin,enabledByDefault: false },
  // { id: 'replicate',         plugin: ReplicateUiPlugin,          enabledByDefault: false },
  // { id: 'replicate-bg',      plugin: ReplicateSimpleBGUiPlugin,  enabledByDefault: false },
  // { id: 'przelewy24',        plugin: Przelewy24UIPlugin,         enabledByDefault: false },
  // { id: 'facet-harmonica',   plugin: FacetHarmonicaUiPlugin,     enabledByDefault: false },
  // { id: 'wfirma',            plugin: WFirmaUIPlugin,             enabledByDefault: false },
  // { id: 'inpost',            plugin: InPostUIPlugin,             enabledByDefault: false },
  // ──────────────────────────────────────────────────────────
];
