import type { Plugin } from 'vitepress';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Unocss from 'unocss/vite';
import { defineConfig } from 'vitepress';

// 另一种 demo 插件
// import { vitepressDemoPlugin } from 'vitepress-demo-plugin'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import locales from './locales.mts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const decodeNamedCharacterReferenceShimPath = path.resolve(__dirname, 'shims/decode-named-character-reference.js');

function decodeNamedCharacterReferenceShim(): Plugin {
  const domIdRe = /decode-named-character-reference[\\/]+index\.dom\.js(?:\\?.*)?$/;
  const shimCode = `import { characterEntities } from 'character-entities';

const own = {}.hasOwnProperty;

export function decodeNamedCharacterReference(value) {
  return own.call(characterEntities, value) ? characterEntities[value] : false;
}`;

  return {
    name: 'decode-named-character-reference-shim',
    enforce: 'pre',
    load(id) {
      if (domIdRe.test(id)) {
        return shimCode;
      }
      return null;
    },
    transform(code, id) {
      if (domIdRe.test(id)) {
        return { code: shimCode, map: null };
      }
      return null;
    },
    async resolveId(id, importer) {
      if (id === 'decode-named-character-reference' || domIdRe.test(id)) {
        return decodeNamedCharacterReferenceShimPath;
      }
      return null;
    }
  };
}


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
      { icon: 'github', link: 'https://github.com/HeJiaYue520/Element-Plus-X' },
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
    resolve: {
      conditions: ['node', 'default'],
      alias: [
        {
          find: /^decode-named-character-reference$/,
          replacement: decodeNamedCharacterReferenceShimPath,
        },
        {
          find: /decode-named-character-reference[\\/]+index\.dom\.js(?:\\?.*)?$/,
          replacement: decodeNamedCharacterReferenceShimPath,
        },
        {
          find: '@jsonlee_12138/markdown-it-mermaid',
          replacement: '@jsonlee_12138/markdown-it-mermaid/dist/es/index.js',
        },
      ],
    },
    plugins: [
      decodeNamedCharacterReferenceShim() as Plugin,
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
      groupIconVitePlugin() as Plugin,
      Unocss() as unknown as Plugin,
    ],
    optimizeDeps: {
      esbuildOptions: {
        conditions: ['node', 'default'],
      },
    },
    ssr: {
      noExternal: ['element-plus', 'gsap', 'decode-named-character-reference'],
      resolve: {
        conditions: ['node', 'default'],
      },
    },
  },
});
