import { fileURLToPath, URL } from 'node:url'
import * as path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 8001 // 将3000修改为你想要的端口号
  },
  define: {
    global: {}
  },
  plugins: [
    vue(),
    vueJsx(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // 指定symbolId格式
      symbolId: '[name]'
      //customDomId: '__svg__icons__dom__'
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }, // defineConfig 下
  build: {
    chunkSizeWarningLimit: 1024,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // 去除所有 console 方法
        pure_funcs: ['console.error', 'console.warn'] // 保留 console.error
      },
      output: {
        comments: false // 去除注释
      }
    }
  }
})
