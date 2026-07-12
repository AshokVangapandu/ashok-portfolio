import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'admin/index.html'),
        projects: resolve(__dirname, 'pages/projects/index.html'),
        widgets: resolve(__dirname, 'widgets/index.html'),
        certifications: resolve(__dirname, 'certifications/index.html'),
      },
    },
  },
});
