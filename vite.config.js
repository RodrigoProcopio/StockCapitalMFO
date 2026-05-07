import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('framer-motion')) return 'vendor-framer';
          if (id.includes('recharts') || id.includes('d3-')) return 'vendor-recharts';
          if (id.includes('embla-carousel')) return 'vendor-embla';
          if (id.includes('react-dom') || id.includes('react-router')) return 'vendor-react';
          if (id.includes('node_modules')) return 'vendor-misc';
        },
      },
    },
  },
})