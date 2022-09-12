import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Icons({})],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src'),
    },
  },
  base: '/',
})
