import type { App } from 'vue';
import { AntdTheme } from 'vite-plugin-vitepress-demo/theme';
import { useData } from 'vitepress';
import Theme from 'vitepress/theme';
import { defineComponent, h } from 'vue';
import { ConfigProvider } from 'vue-element-plus-x';
import DocHeader from '../components/DocHeader.vue';
import PageContributors from '../components/PageContributors.vue';
import SponsorBanner from '../components/SponsorBanner.vue';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vue-element-plus-x/styles/index.css';
import 'virtual:uno.css';
import './var.css';

import './landing.css';
import './markdown.css';
import 'virtual:group-icons.css';

const ProviderLayout = defineComponent({
  setup() {
    const { isDark } = useData();
    return () =>
      h(ConfigProvider, { theme: isDark.value ? 'dark' : 'light' }, () =>
        h(Theme.Layout, null, {
          'layout-top': () => h(SponsorBanner),
          'doc-before': () => h(DocHeader),
          'doc-footer-before': () => h(PageContributors)
        })
      );
  }
});

export default {
  ...Theme,
  Layout() {
    return h(ProviderLayout);
  },
  enhanceApp({ app }: { app: App }) {
    app.component('demo', AntdTheme);
  }
};
