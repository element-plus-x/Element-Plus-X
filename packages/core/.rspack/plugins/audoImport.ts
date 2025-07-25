import AutoImport from 'unplugin-auto-import/rspack';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import Components from 'unplugin-vue-components/rspack';

export default [
  AutoImport({
    imports: ['vue'],
    resolvers: [ElementPlusResolver()],
    eslintrc: {
      enabled: true
    },
    dts: 'src/auto-import.d.ts'
  }),
  Components({
    resolvers: [ElementPlusResolver()]
  })
];
