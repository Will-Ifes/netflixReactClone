/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// O GitHub Pages publica em https://will-ifes.github.io/netflixReactClone/
export default defineConfig({
  base: '/netflixReactClone/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
  },
})
