import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import zlib from 'zlib';
import {defineConfig} from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const basePrefix = '/app';
    server.middlewares.use((req: any, res: any, next: any) => {
      const rawUrl = req.url || '/';
      const [rawPath, rawQuery] = rawUrl.split('?');
      const query = rawQuery ? `?${rawQuery}` : '';

      // Normalize path relative to /app/ so both /... and /app/... work in dev preview
      let relPath = rawPath;
      if (relPath === basePrefix || relPath === `${basePrefix}/`) {
        relPath = '/';
      } else if (relPath.startsWith(`${basePrefix}/`)) {
        relPath = relPath.substring(basePrefix.length);
      }

      if (relPath.startsWith('/css/') && relPath.endsWith('.css')) {
        const filePath = path.join(__dirname, 'public', relPath);
        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'text/css');
          res.end(fs.readFileSync(filePath));
          return;
        }
      }
      if (relPath.startsWith('/js/') && relPath.endsWith('.js')) {
        const filePath = path.join(__dirname, 'public', relPath);
        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'text/javascript; charset=utf-8');
          res.end(fs.readFileSync(filePath));
          return;
        }
      }
      if (relPath.endsWith('.txt')) {
        const filePath = path.join(__dirname, 'public', relPath);
        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(fs.readFileSync(filePath));
          return;
        }
      }
      if (relPath.endsWith('.xml')) {
        const filePath = path.join(__dirname, 'public', relPath);
        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.end(fs.readFileSync(filePath));
          return;
        }
      }

      // Clean URL rewrites for all MPA pages (e.g. /catalogo -> /app/catalogo.html)
      if (relPath && relPath !== '/' && !path.extname(relPath)) {
        const cleanSlug = relPath.replace(/^\/+|\/+$/g, '');
        const candidateHtml = `${cleanSlug}.html`;
        if (cleanSlug && !cleanSlug.includes('/') && htmlFiles.includes(candidateHtml)) {
          req.url = `${basePrefix}/${candidateHtml}${query}`;
          next();
          return;
        }
      }

      // Ensure non-Vite-internal paths include the configured base '/app/' so Vite serves them with 200
      if (
        !rawPath.startsWith(`${basePrefix}/`) &&
        rawPath !== basePrefix &&
        !rawPath.startsWith('/@') &&
        !rawPath.startsWith('/node_modules/')
      ) {
        req.url = `${basePrefix}${relPath === '/' ? '/index.html' : relPath}${query}`;
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
    base: '/app/',
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
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
