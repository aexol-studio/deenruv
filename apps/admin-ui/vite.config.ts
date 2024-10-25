import { Plugin, defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import i18nextLoader from 'vite-plugin-i18next-loader';

export const AdminUIConfig = {
  title: 'Aexol Shop',
  description: 'Aexol Shop',
  logoPath: '/logo.png',
  components: [{ componentPath: './src/custom_fields/DefaultInputs/DefaultTextInput.tsx' }],
};

const htmlPlugin = (): Plugin => {
  return {
    name: 'html-transform',
    async transformIndexHtml(html) {
      return html.replace(
        '<head>',
        `<head><script type="module">window.__ADMIN_UI_CONFIG__ = ${JSON.stringify(AdminUIConfig)}</script>`,
      );
    },
  };
};

export default defineConfig({
  base: '/admin-ui',
  server: { port: 3001 },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  plugins: [
    htmlPlugin(),
    tsconfigPaths(),
    react(),
    i18nextLoader({ paths: ['./src/locales'], namespaceResolution: 'basename' }),
  ],
});
