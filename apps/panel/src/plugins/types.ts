/**
 * Local structural types for the plugin manifest.
 *
 * These mirror the shapes defined in `@deenruv/react-ui-devkit` but are kept
 * here so that the panel's `tsc` check does not depend on the devkit's `dist/`
 * being pre-built. The types are structurally compatible — TypeScript's
 * structural typing guarantees that any value satisfying the devkit's full
 * `DeenruvUIPlugin` / `DeenruvUIPluginManifestItem` type also satisfies these
 * narrower shapes.
 *
 * If the canonical types in `@deenruv/react-ui-devkit` gain new **required**
 * fields that the panel needs to access, update the corresponding type here.
 */

/**
 * Minimal structural type for a UI plugin instance.
 *
 * The panel treats plugins as opaque objects — it never reads their internal
 * fields. This type therefore only requires `name` (for diagnostics) while
 * accepting any additional properties via the index signature.
 */
export type DeenruvUIPlugin = {
  name: string;
  version: string;
  [key: string]: unknown;
};

/**
 * A manifest entry describing an available UI plugin.
 */
export type DeenruvUIPluginManifestItem = {
  /** Unique identifier for the plugin (used in env var to enable/disable) */
  id: string;
  /** The plugin instance */
  plugin: DeenruvUIPlugin;
  /** Whether this plugin is enabled when no env override is provided */
  enabledByDefault: boolean;
};
