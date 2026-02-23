import type { Preview } from '@storybook/vue3';
import { themes } from '@storybook/theming';
import { setup } from '@storybook/vue3';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';

setup(app => app.use(ElementPlus));

const preview: Preview = {
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
      grid: {
        disable: true // 禁用网格
      }
    },
    darkMode: {
      // Override the default dark theme
      dark: { ...themes.dark },
      // Override the default light theme
      light: { ...themes.normal }
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
