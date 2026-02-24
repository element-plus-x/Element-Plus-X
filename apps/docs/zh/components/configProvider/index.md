---
title: 'ConfigProvider'
badge:
  type: 'new'
  version: '2.0.0-beta.0'
---

## 介绍

`ConfigProvider` 是一个全局配置组件，用于在应用的最外层提供统一的配置。它支持主题切换（亮色/暗色）、命名空间配置以及主题变量覆盖。

## 代码演示

### 基本使用

<demo src="./demos/basic.vue"></demo>

### 主题切换（light / dark）

把 `theme` 设置为 `dark` 即开启暗色；设置为 `light` 即关闭暗色（恢复亮色）。当 `theme='dark'` 时组件库会在 `html` 上添加 `dark` 类名，用于启用暗色变量。

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

### 主题覆盖

<demo src="./demos/theme-overrides.vue"></demo>

## 属性

| <div style="width: 130px">属性名</div> |  Type  | 默认值  | 说明                                                                   |
| :------------------------------------- | :----: | :-----: | :--------------------------------------------------------------------- |
| `namespace`                            | String |  'elx'  | 组件的命名空间，用于 CSS 类名前缀                                      |
| `theme`                                | String | 'light' | 主题模式，可选值为 `'light'` 或 `'dark'`                               |
| `themeOverrides`                       | Object |   {}    | 主题变量覆盖配置，用于自定义组件样式                                   |
| `applyTo`                              | String | 'root'  | 主题变量应用范围：`root`（应用到全局 html）/`self`（仅作用于当前包裹） |

## themeOverrides 类型

```typescript
interface ThemeOverrides {
  common?: Record<string, string>; // 通用主题变量
  components?: Record<string, Record<string, string>>; // 组件级别的主题变量
}
```

## 如何配置主题变量

`themeOverrides` 会把 key 转成 `--elx-{key}` 的 CSS 变量。默认 `applyTo="root"` 会应用到全局 `html` 上；设置 `applyTo="self"` 则只作用于当前 `ConfigProvider` 包裹范围。配置时不要写 `--elx-` 前缀。

### 全局覆盖（common）

例如 `color-primary` 会映射为 `--elx-color-primary`：

```ts
const themeOverrides = {
  common: {
    'color-primary': '#7c3aed'
  }
};
```

### 组件覆盖（components）

按组件名分组更方便维护，例如下面会生成 `--elx-attachments-nav-bg` / `--elx-thinking-trigger-bg`：

```ts
const themeOverrides = {
  components: {
    Attachments: {
      'attachments-nav-bg': 'rgba(124, 58, 237, 0.35)',
      'attachments-nav-bg-hover': 'rgba(124, 58, 237, 0.45)',
      'attachments-nav-bg-active': 'rgba(124, 58, 237, 0.55)'
    },
    Thinking: {
      'thinking-trigger-bg': '#f8fafc',
      'thinking-trigger-border-color': 'rgba(15, 23, 42, 0.12)'
    }
  }
};
```

## 主题变量总表（可复制）

所有组件的主题变量总表与可复制模板见：

- [主题变量总表](/zh/guide/theme-tokens)
- [/theme-overrides.template.ts](/theme-overrides.template.ts)

## 插槽

| 插槽名    | 参数 | 类型 | 描述                 |
| --------- | ---- | ---- | -------------------- |
| `default` | -    | Slot | 需要被包裹的组件内容 |

## 功能特性

1. **主题切换** - 支持 `light`（亮色）和 `dark`（暗色）两种主题模式
2. **命名空间** - 可自定义组件的 CSS 类名前缀
3. **主题覆盖** - 支持通过 `themeOverrides` 自定义主题变量
4. **全局生效** - 在组件树中的所有子组件都可获取到配置

## 说明

主题 CSS 变量前缀当前固定为 `--elx-*`（不随 `namespace` 改变）。`namespace` 仅影响组件类名/选择器前缀。

## 使用示例

```vue
<template>
  <ConfigProvider :theme="theme" :namespace="namespace">
    <App />
  </ConfigProvider>
</template>

<script setup>
import { ref } from 'vue';

const theme = ref('light');
const namespace = ref('elx');
</script>
```
