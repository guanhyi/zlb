import { defineConfig } from 'vite'

export default defineConfig({
  // ... 其他配置
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
})