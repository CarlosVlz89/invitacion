import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined;
          }
          if (id.includes('framer-motion')) {
            return 'vendor-motion';
          }
          if (
            id.includes('zod') ||
            id.includes('react-hook-form') ||
            id.includes('@hookform/resolvers')
          ) {
            return 'vendor-forms';
          }
          if (id.includes('lucide-react')) {
            return 'vendor-icons';
          }
          if (id.includes('react-dom') || id.includes('/react/')) {
            return 'vendor-react';
          }
          return 'vendor-misc';
        },
      },
    },
  },
});
