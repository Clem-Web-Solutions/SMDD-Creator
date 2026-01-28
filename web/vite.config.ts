import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Increase limit slightly
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion', 'lucide-react', 'recharts', 'clsx', 'tailwind-merge'],
          'utils-vendor': ['html2canvas', 'file-saver', 'html2pdf.js'],
          'pdf-vendor': ['jspdf'] // implicit dependency of html2pdf often large
        }
      }
    }
  }
})
