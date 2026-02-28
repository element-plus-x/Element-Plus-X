import type { App } from 'vue';
import { AntdTheme } from 'vite-plugin-vitepress-demo/theme';
import { useData } from 'vitepress';
import Theme from 'vitepress/theme';
import { defineComponent, h, onMounted } from 'vue';
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

interface BadgeConfig {
  type: 'beta' | 'new' | 'updated' | 'deprecated' | 'experimental';
  text?: string;
}

const componentBadges: Record<string, BadgeConfig> = {
  '/zh/components/xsender/': { type: 'new', text: '2.0.0' },
  '/zh/components/xMarkdown/': { type: 'beta', text: 'Beta' },
  // '/zh/components/thinking/': { type: 'new', text: '2.0' },
  // '/zh/components/thoughtChain/': { type: 'new', text: '2.0' },
  // '/zh/components/conversations/': { type: 'new', text: '2.0' },
  // '/zh/components/attachments/': { type: 'new', text: '2.0' },
  // '/zh/components/filesCard/': { type: 'new', text: '2.0' },
  // '/zh/components/bubble/': { type: 'new', text: '2.0' },
  // '/zh/components/bubbleList/': { type: 'new', text: '2.0' },
  // '/zh/components/welcome/': { type: 'new', text: '2.0' },
  // '/zh/components/prompts/': { type: 'new', text: '2.0' },
  '/zh/components/configProvider/': { type: 'beta', text: 'Beta' },
  '/en/components/xsender/': { type: 'new', text: '2.0.0' },
  '/en/components/xMarkdown/': { type: 'beta', text: 'Beta' },
  // '/en/components/thinking/': { type: 'new', text: '2.0' },
  // '/en/components/thoughtChain/': { type: 'new', text: '2.0' },
  // '/en/components/conversations/': { type: 'new', text: '2.0' },
  // '/en/components/attachments/': { type: 'new', text: '2.0' },
  // '/en/components/filesCard/': { type: 'new', text: '2.0' },
  // '/en/components/bubble/': { type: 'new', text: '2.0' },
  // '/en/components/bubbleList/': { type: 'new', text: '2.0' },
  // '/en/components/welcome/': { type: 'new', text: '2.0' },
  // '/en/components/prompts/': { type: 'new', text: '2.0' },
  '/en/components/configProvider/': { type: 'beta', text: 'Beta' }
};

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
  }
};
