declare module '@siteDemo' {
  const value: Record<string, any>;
  export default value;
}

declare module 'vite-plugin-vitepress-demo/theme' {
  import type { Component } from 'vue';

  export const AntdTheme: Component;
}

declare const __DOCS_PUBLIC_ORIGIN__: string;
declare const __DOCS_ROOT_ORIGIN__: string;
declare const __DOCS_VERSION_LABEL__: string;
declare const __DOCS_LINE__: 'v1' | 'v2';
declare const __DOCS_V1_ORIGIN__: string;
declare const __DOCS_V2_ORIGIN__: string;
