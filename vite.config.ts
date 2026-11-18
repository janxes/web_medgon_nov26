import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import {defineConfig} from 'vite';

// Automatically detect all HTML files in root for Multi-Page App (MPA) support
const htmlFiles = fs.readdirSync(__dirname).filter((file) => file.endsWith('.html'));
const rollupInput: Record<string, string> = {};
for (const file of htmlFiles) {
  const key = file === 'index.html' ? 'main' : file.replace(/\.html$/, '');
  rollupInput[key] = path.resolve(__dirname, file);
}

// Plugin to serve static CSS and JS assets with correct MIME types in dev mode
const serveStaticAssetsPlugin = (): any => ({
  name: 'serve-static-assets',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      // Soporte transparente para peticiones al subdirectorio /app/
      if (req.url === '/app' || req.url === '/app/') {
        req.url = '/index.html';
      } else if (req.url.startsWith('/app/')) {
        req.url = req.url.substring(4);
      }

      const url = req.url?.split('?')[0] || '';
      if (url.startsWith('/css/') && url.endsWith('.css')) {
        const filePath = path.join(__dirname, 'public', url);
        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'text/css');
          res.end(fs.readFileSync(filePath));
          return;
        }
      }
      if (url.startsWith('/js/') && url.endsWith('.js')) {
        const filePath = path.join(__dirname, 'public', url);
        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'text/javascript');
          res.end(fs.readFileSync(filePath));
          return;
        }
      }
      // Clean URL rewrites for all MPA pages (e.g. /catalogo -> /catalogo.html, /mg87 -> /mg87.html)
      if (url && url !== '/' && !path.extname(url)) {
        const cleanSlug = url.replace(/^\/+|\/+$/g, '');
        const candidateHtml = `${cleanSlug}.html`;
        if (cleanSlug && !cleanSlug.includes('/') && htmlFiles.includes(candidateHtml)) {
          const query = req.url?.includes('?') ? '?' + req.url.split('?')[1] : '';
          req.url = `/${candidateHtml}${query}`;
        }
      }
      next();
    });
  },
});

// Plugin to compress static JS, CSS, HTML, SVG, JSON, XML, and TXT assets in production build (.gz and .br)
const compressStaticAssetsPlugin = (): any => ({
  name: 'compress-static-assets',
  apply: 'build',
  closeBundle() {
    const distDir = path.resolve(__dirname, 'dist');
    if (!fs.existsSync(distDir)) return;
    const compressibleExts = new Set(['.js', '.css', '.html', '.svg', '.json', '.xml', '.txt']);

    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          walk(fullPath);
        } else if (compressibleExts.has(path.extname(entry.name).toLowerCase())) {
          const content = fs.readFileSync(fullPath);
          if (content.length < 1024) continue;
          fs.writeFileSync(`${fullPath}.gz`, zlib.gzipSync(content, {level: 9}));
          fs.writeFileSync(`${fullPath}.br`, zlib.brotliCompressSync(content));
        }
      }
    };

    walk(distDir);
  },
});

export default defineConfig(() => {
  return {
    plugins: [serveStaticAssetsPlugin(), compressStaticAssetsPlugin()],
    build: {
      cssCodeSplit: true,
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        input: rollupInput,
        output: {
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            if (id.includes('lucide-react') || id.includes('motion') || id.includes('framer-motion')) {
              return 'ui-vendor';
            }
            return 'vendor';
          },
        },
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: true,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
