import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        passes: 2,
      },
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),

        allInOnePrinters: resolve(__dirname, 'all-in-one-printers.html'),
        inkjetPrinters: resolve(__dirname, 'inkjet-printers.html'),
        laserPrinters: resolve(__dirname, 'laser-printers.html'),
        inkToner: resolve(__dirname, 'ink-toner.html'),
        blogs: resolve(__dirname, 'blogs.html'),
        customerService: resolve(__dirname, 'customer-service.html'),
        about: resolve(__dirname, 'about.html'),
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          redux: ['react-redux', 'redux', 'redux-thunk'],
          ui: ['lucide-react', 'react-icons', 'framer-motion'],
        },
      },
    },
  },
})
