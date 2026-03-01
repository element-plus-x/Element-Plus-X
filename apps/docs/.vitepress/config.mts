import { execSync } from 'node:child_process';
import type { Plugin } from 'vitepress';
import { fileURLToPath } from 'node:url';
import Unocss from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vitepress';

// 另一种 demo 插件
// import { vitepressDemoPlugin } from 'vitepress-demo-plugin'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import locales from './locales.mts';
import { tovUIResolver } from '../scripts/vue-element-plus-x-resolver';

function getGitBranch(): string {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'main';
  }
}

const gitBranch = getGitBranch();

const cacheDir =
  process.env.NODE_ENV === 'development'
    ? `node_modules/.vitepress-cache-${process.pid}`
    : 'node_modules/.vitepress-cache';

const docsUseSource =
  process.env.DOCS_USE_SOURCE === 'true' || process.env.NODE_ENV === 'development';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Element-Plus-X',
  description: 'A Vue3 + Element-Plus AI Experience Component Library',
  locales,
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
  lastUpdated: true,
  // 全局主题配置（会被 locales 中的配置覆盖）
  themeConfig: {
    logo: '/logo.png',
    logoLink: '/zh/',
    socialLinks: [
      { icon: 'github', link: `https://github.com/element-plus-x/Element-Plus-X` },
      {
        icon: {
          svg: '<svg t="1741408990097" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1514" width="200" height="200"><path d="M64 960V128h832v832z" fill="#CB3837" p-id="1515"></path><path d="M192 320h576v512h-128V448H448v384H192z" fill="#FFFFFF" p-id="1516"></path></svg>',
        },
        link: 'https://www.npmjs.com/package/vue-element-plus-x',
      },
    ],
    search: {
      provider: 'local',
    },
  },
  // markdown 配置
  markdown: {
    // 显示代码行数
    lineNumbers: true,
    container: {
      tipLabel: '💡 Tip',
      warningLabel: '📌 Warning',
      dangerLabel: '💔 Danger',
      infoLabel: '💌 Info',
      detailsLabel: '🎨 Details',
    },
    config(md) {
      // md.use(vitepressDemoPlugin)
      md.use(groupIconMdPlugin);
    },
  },
  vite: {
    cacheDir,
    define: {
      __VITE_GITHUB_BRANCH__: JSON.stringify(gitBranch),
    },
    resolve: {
      alias: docsUseSource
        ? [
            {
              find: /^vue-element-plus-x$/,
              replacement: fileURLToPath(
                new URL('../../../packages/core/src/index.ts', import.meta.url)
              )
            },
            {
              find: /^vue-element-plus-x\/styles\/index\.css$/,
              replacement: fileURLToPath(
                new URL('../../../packages/core/src/styles/index.scss', import.meta.url)
              )
            },
            {
              find: '@configs',
              replacement: fileURLToPath(
                new URL('../../../configs', import.meta.url)
              )
            }
          ]
        : [
            {
              find: '@configs',
              replacement: fileURLToPath(
                new URL('../../../configs', import.meta.url)
              )
            }
          ],
    },
    plugins: [
      // 配置vitepress的插件
      // https://github.com/antfu/vite-plugin-inspect
      // 插件调试
      // inspect(),
      // https://github.com/antfu/vite-plugin-pages
      // 页面路由
      // prismjsPlugin({
      //   languages: 'all', // 语言
      //   theme: 'default', // 主题
      // }) as Plugin,
      AutoImport({
        imports: ['vue'],
        ignore: ['h', 'ClientOnly'],
        dts: fileURLToPath(new URL('../auto-imports.d.ts', import.meta.url)),
        resolvers: [
          ElementPlusResolver({
            exclude: /ElButtonGroup/
          })
        ]
      }) as unknown as Plugin,
      Components({
        dts: fileURLToPath(new URL('../components.d.ts', import.meta.url)),
        dirs: [fileURLToPath(new URL('./components', import.meta.url))],
        resolvers: [tovUIResolver(), ElementPlusResolver({ importStyle: false })]
      }) as unknown as Plugin,
      groupIconVitePlugin() as Plugin,
      Unocss() as unknown as Plugin,
    ],
    ssr: {
      noExternal: ['element-plus', 'gsap', 'vue-element-plus-x'],
    },
  },
});
