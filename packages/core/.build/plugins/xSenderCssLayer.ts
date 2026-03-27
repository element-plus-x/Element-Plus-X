import type { Plugin } from 'vite';

/**
 * 将 x-sender 的 CSS 包裹进 @layer，避免其内部的 .ant 等样式污染用户项目中 ant-design-vue 的全局样式。
 *
 * @layer 内的样式优先级低于任何非 @layer 的普通样式，因此 ant-design-vue 的样式天然优先，互不干扰。
 */
export default function xSenderCssLayerPlugin(): Plugin {
  return {
    name: 'vite-plugin-x-sender-css-layer',
    transform(code, id) {
      if (id.includes('x-sender') && id.endsWith('.css')) {
        return {
          code: `@layer element-plus-x-third-party {
${code}
}`,
          map: null
        };
      }
    }
  };
}
