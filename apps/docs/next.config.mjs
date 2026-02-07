import { createMDX } from "fumadocs-mdx/next";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const uiPkg = JSON.parse(
  readFileSync(
    resolve(__dirname, "../../packages/react-ui-devkit/package.json"),
    "utf-8",
  ),
);

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  output: "standalone", // Required for Docker deployment
  env: {
    NEXT_PUBLIC_DEENRUV_VERSION: uiPkg.version,
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
