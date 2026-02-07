import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  base: '/admin-ui',
  server: { port: 3001 },
  plugins: [tsconfigPaths(), react(), tailwindcss()],
});
