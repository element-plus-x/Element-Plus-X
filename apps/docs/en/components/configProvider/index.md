---
title: 'ConfigProvider'
---

## Introduction

`ConfigProvider` is a global configuration component used to provide unified configuration at the outermost layer of the application. It supports theme switching (light/dark), namespace configuration, and theme variable overrides.

## Code Examples

### Basic Usage

<demo src="./demos/basic.vue"></demo>

### Theme Switching (light / dark)

Set `theme` to `dark` to enable dark mode, and set it to `light` to switch back to light mode. When `theme='dark'`, the library toggles the `dark` class on `html`.

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

### Theme Overrides

<demo src="./demos/theme-overrides.vue"></demo>

## Properties

| <div style="width: 130px">Property Name</div> |  Type  | Default | Description                                                            |
| :-------------------------------------------- | :----: | :-----: | :--------------------------------------------------------------------- |
| `namespace`                                   | String |  'elx'  | Component namespace, used as CSS class name prefix                     |
| `theme`                                       | String | 'light' | Theme mode, options are `'light'` or `'dark'`                          |
| `themeOverrides`                              | Object |   {}    | Theme variable override configuration for customizing component styles |
| `applyTo`                                     | String | 'root'  | Scope: `root` (global html) / `self` (only inside this provider)       |

## themeOverrides Type

```typescript
interface ThemeOverrides {
  common?: Record<string, string>; // Common theme variables
  components?: Record<string, Record<string, string>>; // Component-level theme variables
}
```

## How to Configure Theme Variables

`themeOverrides` converts keys into CSS variables in the form `--elx-{key}`. By default `applyTo="root"` applies them to global `html`; use `applyTo="self"` to scope them to this provider subtree. Do not include the `--elx-` prefix in your config.

### Global Overrides (common)

For example, `color-primary` maps to `--elx-color-primary`:

```ts
const themeOverrides = {
  common: {
    'color-primary': '#7c3aed'
  }
};
```

### Component Overrides (components)

Grouping by component makes maintenance easier. The following produces `--elx-attachments-nav-bg` / `--elx-thinking-trigger-bg`:

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

## Theme Tokens (Copy-paste)

For a complete list of theme tokens (grouped by component) and a copy-paste template:

- [Theme Tokens](/en/guide/theme-tokens)
- [/theme-overrides.template.ts](/theme-overrides.template.ts)

## Slots

| Slot Name | Parameters | Type | Description                     |
| --------- | ---------- | ---- | ------------------------------- |
| `default` | -          | Slot | Component content to be wrapped |

## Features

1. **Theme Switching** - Supports `light` and `dark` theme modes
2. **Namespace** - Customizable CSS class name prefix for components
3. **Theme Overrides** - Supports customizing theme variables via `themeOverrides`
4. **Global Scope** - All child components in the component tree can access the configuration

## Note

Theme CSS variables are currently prefixed with `--elx-*` and do not follow the `namespace` prop. `namespace` only affects component class name prefixes.

## Usage Example

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
