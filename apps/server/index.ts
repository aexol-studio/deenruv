import "reflect-metadata";
import { bootstrap, JobQueueService, runMigrations } from "@deenruv/core";

import { devConfig } from "./dev-config";
import { applyConfigFromJson } from "./plugin-config-loader";
/**
 * This bootstraps the dev server, used for testing Deenruv during development.
 */

const main = async () => {
  console.log("Starting Deenruv server...");

  // Try to import the remote ESM module, fall back to a stub.
  let pkg: any;

  // Fetch a .tgz, extract it to a temp dir, then dynamic-import its ESM entry.
  const importFromTgz = async (url: string) => {
    const fs = await import("fs/promises");
    const path = await import("path");
    const os = await import("os");
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const { pathToFileURL } = await import("url");

    const execAsync = promisify(exec);
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "pkg-"));
    const tgzPath = path.join(tmpRoot, "package.tgz");

    try {
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
      const ab = await res.arrayBuffer();
      await fs.writeFile(tgzPath, Buffer.from(ab));
      await execAsync(`tar -xzf ${tgzPath} -C ${tmpRoot}`);
      const children = await fs.readdir(tmpRoot, { withFileTypes: true });
      const pkgDirEntry = children.find(
        (d) => d.isDirectory() && d.name !== path.basename(tgzPath),
      );
      const pkgDir = pkgDirEntry
        ? path.join(tmpRoot, pkgDirEntry.name)
        : tmpRoot;
      const pkgJsonPath = path.join(pkgDir, "package.json");
      const pkgJsonRaw = await fs.readFile(pkgJsonPath, "utf8");
      const pkgJson = JSON.parse(pkgJsonRaw);
      const entryFile = pkgJson.module ?? pkgJson.main ?? "index.js";
      const entryPath = path.join(pkgDir, entryFile);
      const mod = await import(pathToFileURL(entryPath).toString());
      return (mod && (mod.default ?? mod)) as any;
    } finally {
      // best-effort cleanup
      try {
        await fs.rm(tmpRoot, { recursive: true, force: true });
      } catch {
        // ignore cleanup errors
      }
    }
  };

  try {
    console.log("Loaded fake package (remote tgz):", pkg);
  } catch (err) {
    console.log("Failed to load remote package tgz:", err);
    pkg = { name: "fake-package", version: "0.0.0" }; // stub fallback
  }
  await applyConfigFromJson(devConfig, __dirname);
  await runMigrations(devConfig);
  const app = await bootstrap(devConfig);
  if (process.env.RUN_JOB_QUEUE === "1") {
    await app.get(JobQueueService).start();
  }
};

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
