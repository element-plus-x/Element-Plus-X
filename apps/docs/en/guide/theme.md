---
title: Theme
---

# Theme

## Introduction

Theme support in `vue-element-plus-x` is provided by `ConfigProvider`: switching `light / dark`, and overriding `--elx-*` CSS variables via `themeOverrides`.

## Enable/Disable Dark Mode

Set `theme` to `dark` to enable dark mode, and set it to `light` to switch back. When dark mode is enabled, a `dark` class is added on `html`.

```vue
<template>
  <ConfigProvider :theme="theme">
    <App />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ConfigProvider } from 'vue-element-plus-x';

const theme = ref<'light' | 'dark'>('light');
</script>
```

## VitePress Integration (Recommended)

In `apps/docs/.vitepress/theme/index.ts`, wrap `Theme.Layout` with `ConfigProvider` and map VitePress `isDark` to `theme`:

```ts
import Theme from 'vitepress/theme';
import { defineComponent, h } from 'vue';
import { useData } from 'vitepress';
import { ConfigProvider } from 'vue-element-plus-x';

import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vue-element-plus-x/styles/index.css';

const ProviderLayout = defineComponent({
  setup() {
    const { isDark } = useData();
    return () =>
      h(ConfigProvider, { theme: isDark.value ? 'dark' : 'light' }, () =>
        h(Theme.Layout)
      );
  }
});

export default {
  ...Theme,
  Layout() {
    return h(ProviderLayout);
  }
};
```

Notes:

- If your docs site uses Element Plus components (e.g. `ElScrollbar` / `ElDropdown`), import `element-plus/dist/index.css`
- If you use Element Plus dark variables, import `element-plus/theme-chalk/dark/css-vars.css`
- Import `vue-element-plus-x/styles/index.css` for Element Plus X styles

## Override Theme Variables (themeOverrides)

`themeOverrides` is mapped to CSS variables in the form `--elx-{key}` and applied on global `html`.

```vue
<template>
  <ConfigProvider :theme-overrides="themeOverrides">
    <App />
  </ConfigProvider>
</template>

<script setup lang="ts">
const themeOverrides = {
  components: {
    Welcome: {
      'welcome-filled-bg': '#f0f9ff',
      'welcome-filled-border': '#7dd3fc',
      'welcome-title-color': 'rgba(0, 0, 0, 0.88)'
    }
  }
};
</script>
```

### Global Overrides vs Component Overrides

- `themeOverrides.common`: global tokens (e.g. `color-primary` → `--elx-color-primary`)
- `themeOverrides.components`: grouped by component for readability (e.g. `Welcome.welcome-filled-bg` → `--elx-welcome-filled-bg`)

`components` is mainly for organization and conflict avoidance. In the end, they all map to `--elx-*` CSS variables.

### How to override a component? Where do variables come from?

Each component exposes theme options through the `--elx-*` CSS variables used in its styles. See the complete list here:

- [Theme Tokens](/en/guide/theme-tokens)

When configuring, remove the `--elx-` prefix and use the rest as the key in `themeOverrides`.

### What’s the difference from Element Plus?

- Element Plus variables are prefixed with `--el-*`; this project uses `--elx-*`
- Base variables can inherit Element Plus tokens (e.g. `--elx-color-primary` falls back to `--el-color-primary`). See `packages/core/src/styles/variables.scss`.
- Some styles still use Element Plus `--el-*` tokens and follow Element Plus theming; `--elx-*` can be customized via `themeOverrides`.

## FAQ

1. `namespace` affects component class name prefixes only. Theme CSS variables are always prefixed with `--elx-*`.
