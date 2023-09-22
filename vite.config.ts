import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import svgr from 'vite-plugin-svgr'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],

  resolve: {
    alias: [
      { find: '@src', replacement: path.resolve(__dirname, 'src') },
      { find: '@pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
      { find: '@containers', replacement: path.resolve(__dirname, 'src/containers') },
      { find: '@shared', replacement: path.resolve(__dirname, 'src/shared') },
      { find: '@assets', replacement: path.resolve(__dirname, 'src/assets') }
    ],
  },
})
