import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

function resolve(str: string) {
  return path.resolve(__dirname, str)
}

export default defineConfig({
  plugins: [
    dts({
      // rollupTypes: true,
      include: ['src/**/*'],
      copyDtsFiles: true,
    }),
    react(),
  ],
  build: {
    // 输出文件夹
    outDir: 'dist',
    lib: {
      // 组件库源码的入口文件
      entry: resolve('src/index.tsx'),
      // 组件库名称
      name: 'fiagram',
      // 文件名称, 打包结果举例: suemor.cjs
      fileName: 'index',
      // 打包格式
      formats: ['es', 'cjs', 'umd'],
    },
    rollupOptions: {
      // 排除不相关的依赖
      external: ['react', 'react-dom'],
      output: {
        // 全局变量
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
