import { defineConfig } from '@solidjs/start/config'
import UnoCSS from 'unocss/vite'

export default defineConfig({
  plugins: [UnoCSS()],
  ssr: {
    noExternal: ['@kobalte/core']
  },
  start: {
    server: {
      baseURL: './',
      preset: 'github_pages'
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
