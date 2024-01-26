import { defineConfig } from '@solidjs/start/config'
export default defineConfig({
  start: {
    server: {
      preset: 'node'
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
