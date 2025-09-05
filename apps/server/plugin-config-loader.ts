import path from "path";
import { readFile } from "fs/promises";
import type { DeenruvConfig } from "@deenruv/core";

async function resolveDynamic(value: unknown, baseDir: string): Promise<any> {
  if (Array.isArray(value)) {
    return Promise.all(value.map((v) => resolveDynamic(v, baseDir)));
  }
  if (!isPlainObject(value)) return value;

  if ("$joinDirname" in value) {
    return path.join(baseDir, ...(value.$joinDirname as unknown[] as string[]));
  }

  if ("$env" in value) {
    const envVar = process.env[String((value as any).$env)];
    return envVar ?? (value as any).default ?? "";
  }

  if ("$import" in value && "$class" in value) {
    const mod = await import(String((value as any).$import));
    const Cls = mod[String((value as any).$class)];
    const argsResolved = await resolveDynamic(
      (value as any).args ?? [],
      baseDir,
    );
    const args = Array.isArray(argsResolved) ? argsResolved : [argsResolved];
    return new Cls(...args);
  }

  if ("$import" in value && "$factory" in value) {
    const mod = await import(String((value as any).$import));
    const fn = mod[String((value as any).$factory)];
    const arg = await resolveDynamic((value as any).args, baseDir);
    return fn(arg);
  }

  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(value)) {
    out[k] = await resolveDynamic(v, baseDir);
  }
  return out;
}

function isPlainObject(x: any): x is Record<string, any> {
  return (
    !!x &&
    typeof x === "object" &&
    !Array.isArray(x) &&
    Object.getPrototypeOf(x) === Object.prototype
  );
}

export async function applyConfigFromJson(
  devConfig: DeenruvConfig,
  baseDir: string,
  fileName = "config.json",
) {
  let configJson: any = {};
  try {
    const config = await readFile(path.join(baseDir, fileName), "utf8");
    configJson = JSON.parse(config);
  } catch (e) {
    configJson = devConfig;
  }

  for (const [key, rawValue] of Object.entries(configJson)) {
    if (key === "plugins") continue;
    const resolved = await resolveDynamic(rawValue, baseDir);
    (devConfig as any)[key] = resolved;
  }
  devConfig.plugins = [];
  for (const pluginEntry of configJson.plugins || []) {
    const { name, options, importConfig } = pluginEntry as any;
    try {
      const resolvedOptions = await resolveDynamic(options || {}, baseDir);

      // Backward-compatible shape: { importConfig: { module, path } }
      if (importConfig && importConfig.module && importConfig.path) {
        const { module, path: importPath } = importConfig;
        const loaded = await import(importPath);
        if (loaded && loaded[module]) {
          const pluginType = loaded[module].init(resolvedOptions);
          (devConfig as any).plugins.push(pluginType);
          continue;
        }
      }

      // New shape aligned with other dynamic values: use $import + $class/$export or $factory
      if ("$import" in pluginEntry) {
        const mod = await import(String((pluginEntry as any)["$import"]));

        // Prefer $class (consistent with resolveDynamic) then $export for naming
        const exportName =
          (pluginEntry as any)["$class"] ?? (pluginEntry as any)["$export"];

        if (exportName && mod[String(exportName)]) {
          const exported = mod[String(exportName)];
          // If it's a class with static init, call init(options)
          if (
            exported &&
            typeof exported === "function" &&
            "init" in exported
          ) {
            const pluginType = (exported as any).init(resolvedOptions);
            (devConfig as any).plugins.push(pluginType);
            continue;
          }
          // If it's a factory function, call with options
          if (typeof exported === "function") {
            const pluginType = (exported as any)(resolvedOptions);
            (devConfig as any).plugins.push(pluginType);
            continue;
          }
        }

        // Alternatively, support $factory referencing a named exported function
        if ((pluginEntry as any)["$factory"]) {
          const factory = mod[String((pluginEntry as any)["$factory"])];
          if (typeof factory === "function") {
            const pluginType = await factory(resolvedOptions);
            (devConfig as any).plugins.push(pluginType);
            continue;
          }
        }

        throw new Error(
          `Could not resolve plugin via $import for ${name ?? "<unnamed>"}`,
        );
      }

      // If nothing matched, skip with a warning
      console.warn(
        `Plugin entry${name ? ` "${name}"` : ""} has no usable import config`,
      );
    } catch (e) {
      console.log(`Failed to load plugin ${name}:`, e);
      continue;
    }
  }
}
