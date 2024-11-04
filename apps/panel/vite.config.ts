import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import i18nextLoader from 'vite-plugin-i18next-loader';

export default defineConfig({
  base: '/admin-ui',
  server: { port: 3001 },
  plugins: [
    tsconfigPaths(),
    react(),
    i18nextLoader({ paths: ['./node_modules/@deenruv/admin-dashboard/dist/locales'], namespaceResolution: 'basename' }),
  ],
});
