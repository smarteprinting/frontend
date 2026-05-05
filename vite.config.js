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
        smartPrinterSetupGuide: resolve(__dirname, 'smart-printer-setup-guide.html'),
        modelSearch: resolve(__dirname, 'model-search.html'),
        completeSetup: resolve(__dirname, 'complete-setup.html'),
        installationFailed: resolve(__dirname, 'installation-failed.html'),
        selectYourBrand: resolve(__dirname, 'select-your-brand.html'),
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
