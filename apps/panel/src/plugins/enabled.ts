import type { DeenruvUIPlugin, DeenruvUIPluginManifestItem } from './types';
import { pluginManifest } from './registry';

/**
 * Resolve the set of enabled plugin IDs from the `VITE_ADMIN_UI_PLUGINS`
 * environment variable.
 *
 * Semantics:
 *
 * | Value               | Behaviour                                        |
 * | ------------------- | ------------------------------------------------ |
 * | `undefined` (unset) | Use `enabledByDefault` flags from the manifest   |
 * | `""` (empty string) | Enable **no** plugins                            |
 * | `"all"` or `"*"`    | Enable **every** plugin in the manifest          |
 * | CSV list            | Enable only the listed IDs (deduplicated)        |
 *
 * Unknown IDs that do not match any manifest entry are logged as warnings
 * so typos / stale env vars are caught early.
 */
function resolveEnabledIds(manifest: ReadonlyArray<DeenruvUIPluginManifestItem>): ReadonlySet<string> {
  const envValue = import.meta.env.VITE_ADMIN_UI_PLUGINS as string | undefined;

  // ── unset → manifest defaults ────────────────────────────────────────
  if (envValue === undefined) {
    return new Set(manifest.filter((entry) => entry.enabledByDefault).map((entry) => entry.id));
  }

  // ── empty string → nothing ──────────────────────────────────────────
  if (envValue === '') {
    return new Set<string>();
  }

  const trimmed = envValue.trim();

  // ── "all" / "*" → everything ────────────────────────────────────────
  if (trimmed === 'all' || trimmed === '*') {
    return new Set(manifest.map((entry) => entry.id));
  }

  // ── CSV list → deduplicated set ─────────────────────────────────────
  const ids = trimmed
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const unique = new Set(ids);

  // Warn about unknown IDs so typos are visible during development
  const knownIds = new Set(manifest.map((entry) => entry.id));
  const unknownIds = Array.from(unique).filter((id) => !knownIds.has(id));

  if (unknownIds.length > 0) {
    console.warn(
      `[plugins/enabled] Unknown plugin IDs in VITE_ADMIN_UI_PLUGINS: ${unknownIds.join(', ')}. ` +
        `Available IDs: ${manifest.map((e) => e.id).join(', ')}`,
    );
  }

  return unique;
}

/**
 * The resolved list of `DeenruvUIPlugin` instances that should be installed.
 * This is the single source of truth consumed by `App.tsx`.
 */
export function getEnabledPlugins(): Array<DeenruvUIPlugin> {
  const enabledIds = resolveEnabledIds(pluginManifest);
  return pluginManifest.filter((entry) => enabledIds.has(entry.id)).map((entry) => entry.plugin);
}
