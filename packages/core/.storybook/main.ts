import type { StorybookConfig } from '@storybook/vue3-vite';
import { dirname, join, resolve } from 'node:path';
import autoImportPlugin from '../.build/plugins/autoImport';

// TODO: 需要处理代码展示功能
/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, 'package.json')));
}
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    {
      name: getAbsolutePath('@storybook/addon-essentials'),
      options: {
        docs: false,
        backgrounds: true // 设置组件背景色
      }
    },
    'storybook-dark-mode'
    // getAbsolutePath('@storybook/addon-onboarding'), // 遥测插件
    // getAbsolutePath('@chromatic-com/storybook'), // 视觉测试插件
    // getAbsolutePath('@storybook/experimental-addon-test') // 测试插件
  ],
  staticDirs: ['../storybook-public'],
  framework: {
    name: getAbsolutePath('@storybook/vue3-vite'),
    options: {}
  },
  async viteFinal(viteConfig) {
    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias as Record<string, string> | undefined),
      '@components': resolve(__dirname, '../src/components'),
      '@assets': resolve(__dirname, '../src/assets'),
      '@hooks': resolve(__dirname, '../src/hooks')
    };

    viteConfig.plugins = viteConfig.plugins ?? [];
    (viteConfig.plugins as unknown[]).push(...(autoImportPlugin as unknown[]));

    return viteConfig;
  }
};
export default config;
