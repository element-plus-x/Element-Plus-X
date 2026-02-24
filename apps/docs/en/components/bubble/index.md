---
title: Bubble
---

::: info
`Version 2.0.0` removed the built-in Typewriter component. For Markdown rendering functionality, please use [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)
:::

## Introduction

`Bubble` is a chat bubble component, commonly used in chat scenarios. It can display conversation content, supports custom avatars, headers, content, footers, and has loading state display.

## Code Examples

### Basic Usage

<demo src="./demos/content.vue"></demo>

### Avatar and Placement

<demo src="./demos/avatar-and-placement.vue"></demo>

### Header and Footer

<demo src="./demos/header-and-footer.vue"></demo>

### Loading State

<demo src="./demos/loading.vue"></demo>

### Custom Content

<demo src="./demos/content-customize.vue"></demo>

### Variants and Shapes

<demo src="./demos/variant-and-shape.vue"></demo>

### Theme Overrides (themeOverrides)

Override `Bubble` theme tokens via `ConfigProvider.themeOverrides`. See the full token list and template:

- [Theme Tokens](/en/guide/theme-tokens#bubble)
- [/theme-overrides.template.ts](/theme-overrides.template.ts)

<demo src="./demos/theme-overrides.vue"></demo>

### Using with x-markdown-vue

Starting from v2.0.0, the Typewriter component has been removed. For Markdown rendering functionality, please use [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue) or see the dedicated page: [XMarkdown](/en/components/xMarkdown/).

#### Installation

```bash
pnpm add x-markdown-vue
```

#### Basic Usage

```vue
<template>
  <Bubble :avatar="avatar" placement="start">
    <template #content>
      <MarkdownRenderer :markdown="content" />
    </template>
  </Bubble>
</template>

<script setup>
import { ref } from 'vue';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const avatar = ref('https://example.com/avatar.png');
const content = ref('**Hello** World!\n\nThis is **Markdown** content');
</script>
```

#### Streaming Rendering (Alternative to Typing Effect)

```vue
<template>
  <Bubble :avatar="avatar" placement="start">
    <template #content>
      <MarkdownRenderer :markdown="content" :enable-animate="true" />
    </template>
  </Bubble>
</template>

<script setup>
import { ref } from 'vue';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const content = ref('');
</script>
```

## Properties

| <div style="width: 130px">Property Name</div> |  Type   | Default  | Description                                                                                                                     |
| :-------------------------------------------- | :-----: | :------: | :------------------------------------------------------------------------------------------------------------------------------ |
| `content`                                     | String  |    ''    | Text content to display inside the bubble                                                                                       |
| `placement`                                   | String  | 'start'  | Bubble position, options are `'start'` or `'end'`, representing left and right sides respectively.                              |
| `avatar`                                      | String  |    ''    | Image URL for the bubble avatar                                                                                                 |
| `loading`                                     | Boolean |  false   | Whether to show loading state. When `true`, loading state will be displayed inside the bubble.                                  |
| `shape`                                       | String  |   null   | Bubble shape, options are `'round'` (rounded corners) or `'corner'` (angular).                                                  |
| `variant`                                     | String  | 'filled' | Bubble style variant, options are `'filled'` (filled), `'borderless'` (no border), `'outlined'` (outline), `'shadow'` (shadow). |
| `noStyle`                                     | Boolean |  false   | Whether to remove styles, when `true`, removes built-in `padding` and `background color` from the bubble                        |
| `maxWidth`                                    | String  | '500px'  | Maximum width of bubble content.                                                                                                |
| `avatar-size`                                 | String  |    ''    | Set avatar placeholder size                                                                                                     |
| `avatar-gap`                                  | String  |  '12px'  | Set `gap` value between avatar and bubble                                                                                       |
| `avatar-shape`                                | String  |    ''    | Avatar shape, options are `'circle'` (circular) or `'square'` (square).                                                         |
| `avatar-icon`                                 | String  |    ''    | Avatar icon, priority higher than `avatar`, supports passing icon names like `'user'`.                                          |
| `avatar-src-set`                              | String  |    ''    | Set avatar image srcset attribute                                                                                               |
| `avatar-alt`                                  | String  |    ''    | Set avatar image alt attribute                                                                                                  |
| `avatar-fit`                                  | String  | 'cover'  | Set avatar image `object-fit` attribute, options: `'cover'`, `'contain'`, `'fill'`, `'none'`, `'scale-down'`                    |

## Events

| Event Name     | Parameters     | Type     | Description                         |
| -------------- | -------------- | -------- | ----------------------------------- |
| `@avatarError` | `ref` instance | Function | Triggered when avatar loading fails |

## Ref Instance Methods

| Property Name | Type     | Description                        |
| ------------- | -------- | ---------------------------------- |
| `restart`     | Function | Restart.                           |
| `destroy`     | Function | Actively destroy Bubble component. |

## Slots

| Slot Name  | Parameters | Type | Description                                 |
| ---------- | ---------- | ---- | ------------------------------------------- |
| `#avatar`  | -          | Slot | Custom avatar display content               |
| `#header`  | -          | Slot | Custom bubble top display content           |
| `#content` | -          | Slot | Custom bubble display content               |
| `#loading` | -          | Slot | Custom bubble loading state display content |
| `#footer`  | -          | Slot | Custom bubble bottom display content        |

## Features

1. **Layout Direction** - Supports left alignment (`start`) and right alignment (`end`)
2. **Content Types** - Supports plain text, custom slot content
3. **Loading State** - Built-in loading animation, supports custom loading content
4. **Visual Effects** - Provides multiple shapes and variants (rounded/angular corners, filled/outlined/shadow, etc.)
5. **Flexible Slots** - Provides avatar, header, content, footer, loading state and other slots
