import type { PluginOption } from 'vite';
import AutoImport from 'unplugin-auto-import/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/vite';

const plugins: PluginOption[] = [
  AutoImport({
    imports: ['vue'],
    ignore: ['h'],
    resolvers: [ElementPlusResolver()],
    eslintrc: {
      enabled: true
    },
    dts: 'src/auto-import.d.ts',
    // 确保在构建时也生成类型声明
    vueTemplate: true
  }) as PluginOption,
  Components({
    resolvers: [ElementPlusResolver({ importStyle: false })],
    dts: 'src/components.d.ts'
  }) as PluginOption
];

export default plugins;
