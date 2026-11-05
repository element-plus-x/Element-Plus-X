import path, { resolve } from 'node:path';
import process from 'node:process';
import { visualizer } from 'rollup-plugin-visualizer'; // 打包分析插件
import { defineConfig } from 'vite';
import plugins from './.build/plugins';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    ...plugins, // 基础插件配置
    // 打包分析插件，生成可视化的打包分析报告
    visualizer({
      filename: 'dist/stats.html', // 分析报告输出文件名
      open: true, // 构建完成后自动打开分析报告
      gzipSize: true, // 显示 gzip 压缩后的大小
      brotliSize: true, // 显示 brotli 压缩后的大小
      template: 'treemap' // 使用树状图模板，可选：treemap、sunburst、network
    })
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@hooks': path.resolve(__dirname, './src/hooks')
    }
  },
  build: {
    lib: {
      name: 'ElementPlusX',
      entry: resolve(__dirname, './src/index.ts'),
      formats: ['umd'],
      fileName: format => {
        return `${format}/index.js`;
      },
      // vite 会自动追加 .css 后缀（vite 8 语义）
      cssFileName: 'styles'
    },
    rolldownOptions: {
      // 外部依赖配置，这些依赖不会被打包，需要用户自行提供
      external: [
        'vue', // Vue 3 核心库
        'vue/jsx-runtime', // Vue JSX 运行时
        '@element-plus/icons-vue' // Element Plus 图标库
      ],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    },
    emptyOutDir: false,
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    cssCodeSplit: false
  }
});
