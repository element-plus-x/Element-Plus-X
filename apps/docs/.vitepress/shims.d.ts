declare module '@siteDemo' {
  const value: Record<string, any>;
  export default value;
}

declare module 'vite-plugin-vitepress-demo/theme' {
  import type { Component } from 'vue';

  export const AntdTheme: Component;
}
