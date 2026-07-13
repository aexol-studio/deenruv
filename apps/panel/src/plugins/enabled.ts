import type { DeenruvUIPlugin } from './types';
import { pluginManifest } from './registry';

/**
 * The installed plugin list is static for every deployment. Individual plugin
 * surfaces are filtered by the authenticated administrator's permissions.
 */
export function getEnabledPlugins(): Array<DeenruvUIPlugin> {
  return pluginManifest.filter((entry) => entry.enabledByDefault).map((entry) => entry.plugin);
}
