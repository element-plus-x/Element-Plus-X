---
title: 主题配置
---

# 主题配置

## 介绍

`vue-element-plus-x` 的主题能力由 `ConfigProvider` 提供：支持 `light / dark` 切换，以及通过 `themeOverrides` 覆盖 `--elx-*` CSS 变量。

## 开启/关闭暗色模式

把 `theme` 设置为 `dark` 即开启暗色；设置为 `light` 即恢复亮色。开启暗色时会在 `html` 上添加 `dark` 类名以启用暗色变量。

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

## VitePress 接入（推荐）

在 `apps/docs/.vitepress/theme/index.ts` 中用 `ConfigProvider` 包裹 `Theme.Layout`，并把 VitePress 的 `isDark` 映射为 `theme`：

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

要点：

- 文档站使用 Element Plus 组件时，需要引入 `element-plus/dist/index.css`
- 使用 Element Plus 的暗色变量时，需要引入 `element-plus/theme-chalk/dark/css-vars.css`
- 组件库自身样式建议引入 `vue-element-plus-x/styles/index.css`

## 覆盖主题变量（themeOverrides）

`themeOverrides` 会被映射为 `--elx-{key}` 形式的 CSS 变量，并应用到全局 `html` 上，供组件消费。

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

### 全局覆盖 vs 组件覆盖

- `themeOverrides.common`：全局通用变量（例如 `color-primary` → `--elx-color-primary`）
- `themeOverrides.components`：按组件维度组织（例如 `Welcome.welcome-filled-bg` → `--elx-welcome-filled-bg`）

`components` 的组织方式主要是为了可读性与避免命名冲突，本质上都会映射为 `--elx-*` 的 CSS 变量。

### 每个组件怎么配？变量从哪里来？

组件的可配置项就是它在样式里使用的 `--elx-*` 变量，完整列表见：

- [主题变量总表](/zh/guide/theme-tokens)

配置时只需要去掉前缀 `--elx-`，把剩余部分作为 key 写进 `themeOverrides` 即可。

### 和 Element Plus 有什么区别？

- Element Plus 主题变量前缀是 `--el-*`，本项目主题变量前缀是 `--elx-*`
- 本项目基础变量可继承 Element Plus 变量（例如 `--elx-color-primary` 默认取 `--el-color-primary`），定义见 `packages/core/src/styles/variables.scss`
- 部分样式仍使用 Element Plus 的 `--el-*` 变量，会跟随 Element Plus 主题变化；使用 `--elx-*` 的部分可通过 `themeOverrides` 覆盖

## 常见问题

1. `namespace` 只影响组件类名前缀，不影响主题 CSS 变量前缀（主题变量固定为 `--elx-*`）。
