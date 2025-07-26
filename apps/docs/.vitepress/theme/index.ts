import type { App } from 'vue';
import { AntdTheme } from 'vite-plugin-vitepress-demo/theme';
import Theme from 'vitepress/theme';
import { h } from 'vue';
import SponsorBanner from '../components/SponsorBanner.vue';
import PageContributors from '../components/PageContributors.vue';
import 'virtual:uno.css';
import './var.css';

import './landing.css';
import './markdown.css';
import 'virtual:group-icons.css';

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'layout-top': () => h(SponsorBanner),
      "doc-footer-before": () => h(PageContributors)
    });
  },
  enhanceApp({ app }: { app: App }) {
    app.component('demo', AntdTheme);
  }
};
