import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/',
  plugins: [
    {
      name: 'admin-fallback-middleware',
      configureServer(server) {
        server.middlewares.use((req: any, _res: any, next: any) => {
          if (req.url) {
            const urlObj = new URL(req.url, 'http://localhost');
            const pathname = urlObj.pathname;
            
            // 1. Intercept asset/source files resolved relatively under nested admin routes and rewrite to root
            const assetMatch = pathname.match(/\/(src|css|assets|node_modules|@vite|@id|@fs)\/(.*)$/i);
            if (assetMatch) {
              req.url = '/' + assetMatch[1] + '/' + assetMatch[2] + urlObj.search;
              next();
              return;
            }

            // 2. Intercept admin sub-pages and fallback to admin index.html
            const lowerPath = pathname.toLowerCase();
            if (lowerPath.startsWith('/admin') && !lowerPath.includes('.')) {
              req.url = '/admin/index.html' + urlObj.search;
            }
          }
          next();
        });
      }
    }
  ],
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
