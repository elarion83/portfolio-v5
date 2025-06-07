import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/*',
          dest: ''
        }
      ]
    })
  ],
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react'],
    exclude: []
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'motion': ['framer-motion'],
          'icons': ['lucide-react']
        }
      }
    },
    cssCodeSplit: false,
    minify: false,
    ssrManifest: true
  },
  server: {
    headers: {
      'Cache-Control': 'no-store'
    },
    hmr: {
      timeout: 5000
    }
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'lucide-react']
  },
  clearScreen: false,
  esbuild: {
    treeShaking: true,
    minifyIdentifiers: false,
    minifySyntax: false,
    minifyWhitespace: false
  },
  logLevel: 'info',
  mode: 'development'
});