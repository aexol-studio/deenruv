import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import devTranslatePlugin, { Languages } from '@aexol/vite-plugin-dev-translate';

export default defineConfig({
  base: '/admin-ui',
  server: { port: 3001 },
  plugins: [
    tsconfigPaths(),
    react(),
    // devTranslatePlugin({
    //   apiKey: '4404413a.b16aaa6',
    //   folderName: 'en',
    //   localeDir: '../../packages/admin-dashboard/src/locales',
    //   lang: Languages.ENUS,
    // }),
  ],
});
