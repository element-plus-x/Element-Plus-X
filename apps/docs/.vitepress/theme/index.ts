import type { App } from 'vue';
import { AntdTheme } from 'vite-plugin-vitepress-demo/theme';
import Theme from 'vitepress/theme';
import { h } from 'vue';
import { parseHTML } from 'linkedom';
import DocHeader from '../components/DocHeader.vue';
import PageContributors from '../components/PageContributors.vue';
import SponsorBanner from '../components/SponsorBanner.vue';
import 'virtual:uno.css';
import './var.css';

import './landing.css';
import './markdown.css';
import 'virtual:group-icons.css';

const globalAny = globalThis as typeof globalThis & {
  document?: Document;
  window?: Window;
  DOMParser?: typeof DOMParser;
  Element?: typeof Element;
  HTMLElement?: typeof HTMLElement;
  HTMLImageElement?: typeof HTMLImageElement;
  navigator?: Navigator;
};

if (typeof globalAny.document === 'undefined') {
  const { window } = parseHTML('<!doctype html><html><body></body></html>');
  globalAny.window = window as unknown as Window;
  globalAny.document = window.document;
  globalAny.DOMParser = window.DOMParser;
  globalAny.Element = window.Element;
  globalAny.HTMLElement = window.HTMLElement;
  globalAny.HTMLImageElement = window.HTMLImageElement;
  if (typeof window.document.hasFocus !== 'function') {
    window.document.hasFocus = () => false;
  }
  try {
    if (!('navigator' in globalAny)) {
      globalAny.navigator = window.navigator;
    }
  } catch {
    // Node's global navigator may be read-only; ignore.
  }
}

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'layout-top': () => h(SponsorBanner),
      'doc-before': () => h(DocHeader),
      'doc-footer-before': () => h(PageContributors)
    });
  },
  enhanceApp({ app }: { app: App }) {
    app.component('demo', AntdTheme);
  }
};
