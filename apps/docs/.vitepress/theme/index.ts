import type { App } from 'vue';
import { AntdTheme } from 'vite-plugin-vitepress-demo/theme';
import { useData } from 'vitepress';
import Theme from 'vitepress/theme';
import { defineComponent, h, onMounted } from 'vue';
import { ConfigProvider } from 'vue-element-plus-x';
import DocHeader from '../components/DocHeader.vue';
import FullChangelog from '../components/FullChangelog.vue';
import PageContributors from '../components/PageContributors.vue';
import SponsorBanner from '../components/SponsorBanner.vue';
import { componentBadges } from '../config/component-config';
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vue-element-plus-x/styles/index.css';
import 'virtual:uno.css';
import './var.css';

import './landing.css';
import './markdown.css';
import 'virtual:group-icons.css';

function addSidebarBadges() {
  const sidebarLinks = document.querySelectorAll('.VPSidebar a.VPLink');

  sidebarLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    const badgeConfig = componentBadges[href];
    if (!badgeConfig) return;

    const parentItem = link.closest('.item');
    if (!parentItem) return;

    if (parentItem.querySelector('.sidebar-badge')) return;

    const badge = document.createElement('span');
    badge.className = `sidebar-badge sidebar-badge--${badgeConfig.type}`;
    badge.textContent = badgeConfig.text || badgeConfig.type;

    const textSpan =
      link.querySelector('.link-text') || link.querySelector('.text');
    if (textSpan) {
      textSpan.appendChild(badge);
    } else {
      link.appendChild(badge);
    }
  });
}

const ProviderLayout = defineComponent({
  setup() {
    const { isDark } = useData();

    onMounted(() => {
      addSidebarBadges();

      const observer = new MutationObserver(() => {
        addSidebarBadges();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });

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
    app.component('FullChangelog', FullChangelog);
  }
};
