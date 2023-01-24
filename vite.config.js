import { fileURLToPath, URL } from 'node:url'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import ElementPlus from 'unplugin-element-plus/vite'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({
          importStyle: 'sass',
        }),
      ],
    }),
    // 修正 'ElMessage', 'ElNotification', 'ElMessageBox' 樣式問題
    // 無需手動導出
    ElementPlus({
      useSource: true,
    }),
  ],
  css: {
    preprocessorOptions: {
      scss: {
        // 自定義主題 css 變數
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: 'terser',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1)
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img'
          }
          return `${extType}/[name][extname]`
        },
        chunkFileNames: 'js/[name].js',
        entryFileNames: 'js/[name]-[hash].js',
        manualChunks(id) {
          // if (id.includes('styles/tailwind.css')) {
          //   return 'tailwind'
          // }
          // if (id.includes('element-plus')) {
          //   return 'elems'
          // }
          // if (id.includes('lodash')) {
          //   return 'lodash'
          // }
          if (id.includes('node_modules')) {
            return 'vendor'
            // return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        },
      },
    },
  },
})
