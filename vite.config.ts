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
    },
    rollupOptions: {
      output: {
        sourcemap: false,
        chunkFileNames: 'assets/js/index-[hash].js',
        entryFileNames: 'assets/js/index-[hash].js',
        assetFileNames: 'assets/[ext]/index-[hash].[ext]',
        manualChunks(id) {
          // id为文件的绝对路径
          if (id.includes('node_modules')) {
            // if (id.includes('node_modules/vue')) {
            //   return 'vue-vendor'
            // }

            // if (id.includes('node_modules/element-plus')) {
            //   return 'elementplus-vendor'
            // }

            // if (id.includes('node_modules/vant')) {
            //   return 'vant-vendor'
            // }

            // if (id.includes('node_modules/html2canvas')) {
            //   return 'html2canvas'
            // }

            // if (id.includes('node_modules/lightweight-charts')) {
            //   return 'lightweight-charts'
            // }

            // if (id.includes('node_modules/echarts')) {
            //   return 'echarts'
            // }

            // if (id.includes('node_modules/moment')) {
            //   return 'moment'
            // }

            // if (id.includes('node_modules/swiper')) {
            //   return 'swiper'
            // }

            // if (id.includes('node_modules/web3')) {
            //   return 'web3'
            // }

            // if (id.includes('node_modules/ethers')) {
            //   return 'ethers'
            // }

            // if (id.includes('node_modules/vue-i18n')) {
            //   return 'vue-i18n'
            // }

            // if (id.includes('node_modules/pinia')) {
            //   return 'pinia'
            // }

            // if (id.includes('node_modules/firebase')) {
            //   return 'firebase'
            // }

            // if (id.includes('node_modules/@reown')) {
            //   return '@reown'
            // }

            // if (id.includes('node_modules/@solana')) {
            //   return '@solana'
            // }

            // if (id.includes('node_modules/crypto-js')) {
            //   return 'crypto-js'
            // }

            // if (id.includes('node_modules/@goplus')) {
            //   return '@goplus'
            // }

            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  }
})
