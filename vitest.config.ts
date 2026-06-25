import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'app'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['app/**/*.{test,spec}.ts'],
  },
})
