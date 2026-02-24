import type { Preview } from '@storybook/vue3';
import { addons } from '@storybook/preview-api';
import { themes } from '@storybook/theming';
import { setup } from '@storybook/vue3';
import ElementPlus from 'element-plus';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { onMounted, onUnmounted, ref } from 'vue';
import ConfigProvider from '../src/components/ConfigProvider/index.vue';
import 'element-plus/dist/index.css';

import '../src/styles/index.scss';
import './preview.scss';

setup(app => app.use(ElementPlus));

function withTheme(story: any) {
  return {
    components: { Story: story(), ConfigProvider },
    setup() {
      const isDark = ref(false);
      const handler = (value: boolean) => {
        isDark.value = value;
      };

      const syncFromLocalStorage = () => {
        try {
          const raw = window.localStorage.getItem('sb-addon-themes-3');
          const store = raw ? JSON.parse(raw) : null;
          isDark.value = store?.current === 'dark';
        } catch {}
      };

      syncFromLocalStorage();

      onMounted(() => {
        const channel = addons.getChannel();
        channel.on(DARK_MODE_EVENT_NAME, handler);
      });

      onUnmounted(() => {
        const channel = addons.getChannel();
        channel.off(DARK_MODE_EVENT_NAME, handler);
      });

      return { isDark };
    },
    template: `<ConfigProvider :theme="isDark ? 'dark' : 'light'"><Story /></ConfigProvider>`
  };
}

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      },
      disableSaveFromUI: true
      // expanded: true // 默认展开所有组件描述
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f5f7fa' },
        { name: 'dark', value: '#1b1b1f' }
      ],
      grid: {
        disable: true // 禁用网格
      }
    },
    darkMode: {
      // Override the default dark theme
      dark: { ...themes.dark },
      // Override the default light theme
      light: { ...themes.normal },
      classTarget: 'html',
      darkClass: 'dark'
    }
  }
};

const cdnAssets = [
  {
    url: 'https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css'
  }
];
cdnAssets.forEach(assets => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = assets.url;
  document.head.appendChild(link);
});

export default preview;
