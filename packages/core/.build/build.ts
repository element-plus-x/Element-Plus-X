import type { BuildEnvironmentOptions } from 'vite';
import { extname, join, relative, resolve } from 'node:path';
import fg from 'fast-glob';

const root = resolve(__dirname, '../');

const entries = fg.globSync('src/components/*/*.(tsx|ts|vue)', {
  ignore: ['src/components/**/*.d.ts', 'src/components/**/*.types.ts']
});

const hooksEntries = fg.globSync('src/hooks/*.(ts|tsx)', {
  ignore: ['src/hooks/**/*.d.ts', 'src/hooks/**/*.types.ts']
});

const entriesObj = Object.fromEntries(
  entries.map(f => {
    return [
      relative('src/components', f.slice(0, f.length - extname(f).length)),
      join(root, f)
    ];
  })
);

const hooksEntriesObj = Object.fromEntries(
  hooksEntries.map(f => {
    return [
      `hooks/${relative('src/hooks', f.slice(0, f.length - extname(f).length))}`,
      join(root, f)
    ];
  })
);

const buildConfig: BuildEnvironmentOptions = {
  lib: {
    name: 'ElementPlusX',
    entry: {
      index: resolve(__dirname, '../src/index.ts'),
      components: resolve(__dirname, '../src/components.ts'),
      ...entriesObj,
      ...hooksEntriesObj
    },
    fileName: (format, entryName) => {
      return `${format}/${entryName}.js`;
    },
    formats: ['es']
  },
  rollupOptions: {
    // 确保外部化处理那些你不想打包进库的依赖
    external: ['vue', 'vue/jsx-runtime', '@element-plus/icons-vue'],
    output: {
      // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      globals: {
        vue: 'Vue'
      },
      exports: 'named', // 确保有命名导出
      assetFileNames: ((info: any) => {
        const srcName = info.originalFileNames[0];
        if (srcName) {
          if (srcName.includes('src/components/')) {
            const fileName = srcName
              .replace('src/components/', '')
              .replace('index.vue', 'index.css');
            return `es/${fileName}`;
          }
        }
        return info.name;
      }) as unknown as string
    }
  },
  sourcemap: true,
  // 减少文件大小
  minify: 'terser',
  // CSS 处理
  cssCodeSplit: true,
  // 确保只生成一个CSS文件
  emptyOutDir: false
};

export default buildConfig;
