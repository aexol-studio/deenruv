/* global process */
import { createMDX } from "fumadocs-mdx/next";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Resolve version with graceful fallback for isolated Docker builds
 * where the monorepo packages directory is not available.
 *
 * Priority: env override → monorepo package → docs package version
 */
function resolveVersion() {
  if (process.env.NEXT_PUBLIC_DEENRUV_VERSION) {
    return process.env.NEXT_PUBLIC_DEENRUV_VERSION;
  }

  try {
    const uiPkgPath = resolve(
      __dirname,
      "../../packages/react-ui-devkit/package.json",
    );
    const uiPkg = JSON.parse(readFileSync(uiPkgPath, "utf-8"));
    return uiPkg.version;
  } catch {
    // Fallback: use docs package version (always available)
    const docsPkgPath = resolve(__dirname, "package.json");
    const docsPkg = JSON.parse(readFileSync(docsPkgPath, "utf-8"));
    return docsPkg.version;
  }
}

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "standalone", // Required for Docker deployment
  env: {
    NEXT_PUBLIC_DEENRUV_VERSION: resolveVersion(),
  },
  async rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/docs/:path*",
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(config);
