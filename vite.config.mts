import { defineConfig } from '@solidjs/start/config'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [UnoCSS()],
  ssr: {
    noExternal: ['@kobalte/core']
  },
  start: {
    server: {
      preset: 'vercel'
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
