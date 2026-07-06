import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' — GitHub Pages などサブパス配信でも動くように相対パスにする
export default defineConfig({
  plugins: [react()],
  base: './',
})
