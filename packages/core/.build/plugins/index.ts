import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import autoImportPlugin from './autoImport';
import dtsPlugin from './dts';
import { injectCss } from './injectCss';
// import prismjsPlugin from './prismjs'

const plugins: PluginOption[] = [
  vue({
    script: {
      propsDestructure: true
    }
  }) as PluginOption,
  // prismjsPlugin,
  ...autoImportPlugin,
  dtsPlugin as PluginOption,
  injectCss()
];

export default plugins;
