import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createRequire } from 'node:module';
import path from 'path';
import { fileURLToPath } from 'url';

const configDir = path.dirname(fileURLToPath(import.meta.url));
const requireFromConfig = createRequire(import.meta.url);
const reactUiDevkitDir = path.resolve(configDir, 'node_modules/@deenruv/react-ui-devkit');
const tiptapPmDir = path.resolve(
  requireFromConfig.resolve('@tiptap/pm/state', { paths: [reactUiDevkitDir] }),
  '../../..',
);
const prosemirrorPackages = [
  'prosemirror-changeset',
  'prosemirror-commands',
  'prosemirror-dropcursor',
  'prosemirror-gapcursor',
  'prosemirror-history',
  'prosemirror-inputrules',
  'prosemirror-keymap',
  'prosemirror-model',
  'prosemirror-schema-list',
  'prosemirror-state',
  'prosemirror-tables',
  'prosemirror-transform',
  'prosemirror-view',
] as const;

const resolvePackageRoot = (packageName: string) =>
  path.resolve(path.dirname(requireFromConfig.resolve(packageName, { paths: [tiptapPmDir] })), '..');

// Keep every bare ProseMirror import on TipTap's @tiptap/pm dependency graph.
// Otherwise linked workspace packages can bundle both prosemirror-state@1.4.3 and @1.4.4,
// which crashes TipTap with duplicate keyed plugins at runtime.
const prosemirrorAliases = Object.fromEntries(
  prosemirrorPackages.map((packageName) => [packageName, resolvePackageRoot(packageName)]),
);

export default defineConfig({
  base: '/admin-ui',
  server: { port: 6101 },
  plugins: [tsconfigPaths(), react(), tailwindcss()],
  optimizeDeps: {
    // Force re-optimization after patching @radix-ui/react-compose-refs.
    // Remove this flag once the cache is rebuilt.
    force: true,
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router', 'zustand', ...prosemirrorPackages],
    alias: {
      ...prosemirrorAliases,
      // Resolve workspace package imports from linked admin-dashboard dist via the panel app graph.
      '@deenruv/react-ui-devkit': path.resolve(configDir, 'node_modules/@deenruv/react-ui-devkit'),
      // Patch: fix React 19 infinite loop in @radix-ui/react-compose-refs@1.1.2
      // See: https://github.com/radix-ui/primitives/issues/3799
      // Remove when upstream publishes a fix.
      '@radix-ui/react-compose-refs': path.resolve(configDir, 'radix-compose-refs-patch.js'),
    },
  },
});
