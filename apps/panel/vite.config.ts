import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

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
    dedupe: ['react', 'react-dom', 'react-router', 'zustand'],
    alias: {
      // Patch: fix React 19 infinite loop in @radix-ui/react-compose-refs@1.1.2
      // See: https://github.com/radix-ui/primitives/issues/3799
      // Remove when upstream publishes a fix.
      '@radix-ui/react-compose-refs': path.resolve(__dirname, 'radix-compose-refs-patch.js'),
    },
  },
});
