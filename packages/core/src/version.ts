/**
 * @description
 * A constant which holds the current version of the Deenruv core. You can use
 * this when your code needs to know the version of Deenruv which is running.
 *
 * @example
 * ```ts
 * import { DEENRUV_VERSION } from '\@deenruv/core';
 *
 * console.log('Deenruv version:', DEENRUV_VERSION);
 * ```
 *
 * @docsCategory common
 * @since 2.0.0
 */
import * as path from "node:path";

function getCorePackageVersion(): string {
  const candidates = [
    // When running from TS sources (e.g. ts-node)
    path.join(__dirname, "..", "package.json"),
    // When running compiled code from dist/src
    path.join(__dirname, "..", "..", "package.json"),
  ];

  for (const candidate of candidates) {
    try {
      const pkg = require(candidate);
      if (pkg && typeof pkg.version === "string") {
        return pkg.version as string;
      }
    } catch {
      // try next candidate
    }
  }

  // Fallback: resolve via package exports if available
  try {
    const pkg = require("@deenruv/core/package.json");
    if (pkg && typeof pkg.version === "string") {
      return pkg.version as string;
    }
  } catch {
    // ignore
  }

  return "0.0.0";
}

export const DEENRUV_VERSION: string = getCorePackageVersion();
