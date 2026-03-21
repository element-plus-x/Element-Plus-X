---
title: Migrate from v1 to v2
---

# Migrate from v1 to v2

## Overview

v2.0.0 is a major release with several breaking changes. Here is a summary of the key changes:

- **6 components removed/renamed**: `Typewriter`, `XMarkdown`, `XMarkdownAsync`, `Sender`, `MentionSender`, `EditorSender` are no longer bundled
- **2 new components**: `XSender`, `ConfigProvider`
- **New theme system**: Based on `--elx-*` CSS variables, with light/dark mode support
- **Hooks changes**: Removed `usePrism`, added `useNamespace` and `useTheme`; `XRequest` is deprecated
- **Markdown rendering extracted to external package**: [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)

::: tip Migration Advice
Before starting the migration, make sure to back up your project. It is recommended to complete the migration in a development environment first, and deploy to production only after confirming everything works correctly.
:::

## Quick Checklist

| Migration Item              | Type       | Impact                        | Details                                                                             |
| --------------------------- | ---------- | ----------------------------- | ----------------------------------------------------------------------------------- |
| `Typewriter`                | Removed    | Pages using typewriter effect | → [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue) + `enable-animate` |
| `XMarkdown`                 | Removed    | Markdown rendering            | → `MarkdownRenderer` from `x-markdown-vue`                                          |
| `XMarkdownAsync`            | Removed    | Async Markdown rendering      | → `MarkdownRenderer` from `x-markdown-vue`                                          |
| `Sender`                    | Renamed    | Input component               | → `XSender`                                                                         |
| `MentionSender`             | Renamed    | Mention input component       | → `XSender` + `mentionConfig`                                                       |
| `EditorSender`              | Renamed    | Rich text input component     | → `XSender` (minor API changes, requires plugin version > 1.3.98)                   |
| `usePrism`                  | Removed    | Code highlighting hook        | → Built-in Shiki in `x-markdown-vue`                                                |
| `XRequest`                  | Deprecated | SSE requests                  | → Recommended: [hook-fetch](https://jsonlee12138.github.io/hook-fetch/)             |
| `useSend`                   | No changes | Send state management hook    | Continue using as-is                                                                |
| `useRecord`                 | No changes | Speech recognition hook       | Continue using as-is                                                                |
| `useXStream`                | No changes | SSE streaming hook            | Continue using as-is                                                                |
| `useNamespace`              | Added      | —                             | Internal BEM namespace hook                                                         |
| `useTheme`                  | Added      | —                             | Theme variable management hook                                                      |
| `ConfigProvider`            | Added      | —                             | Global theme and dark mode configuration                                            |
| `BubbleList.triggerIndices` | Removed    | Pages using this prop         | Removed from source, no migration needed                                            |
| `BubbleList.@complete`      | Removed    | Pages listening to this event | Removed from source, no migration needed                                            |
| CSS Variables               | Changed    | Custom styles                 | `--elx-*` prefix                                                                    |

## Upgrade Dependencies

### Version Requirements

| Dependency   | Minimum Version               | Notes                                          |
| ------------ | ----------------------------- | ---------------------------------------------- |
| Vue          | >= 3.5.17                     | v2 requires newer Vue reactivity features      |
| Element Plus | >= 2.9.7                      | Components depend on new Element Plus features |
| Node.js      | >= 18.x (recommended >= 20.x) | Development environment                        |

### Upgrade Commands

::: code-group

```sh [pnpm]
pnpm update vue-element-plus-x@latest
pnpm update vue@">=3.5.17"
pnpm update element-plus@">=2.9.7"
```

```sh [npm]
npm install vue-element-plus-x@latest
npm install vue@">=3.5.17"
npm install element-plus@">=2.9.7"
```

```sh [yarn]
yarn add vue-element-plus-x@latest
yarn add vue@">=3.5.17"
yarn add element-plus@">=2.9.7"
```

:::

### Install x-markdown-vue (if using Markdown rendering)

If your project uses `Typewriter`, `XMarkdown`, or `XMarkdownAsync`, install the standalone package:

::: code-group

```sh [pnpm]
pnpm add x-markdown-vue
pnpm add katex
pnpm add shiki shiki-stream
```

```sh [npm]
npm install x-markdown-vue
npm install katex
npm install shiki shiki-stream
```

```sh [yarn]
yarn add x-markdown-vue
yarn add katex
yarn add shiki shiki-stream
```

:::

::: info

- `katex`: For LaTeX math formula rendering (optional)
- `shiki` / `shiki-stream`: For code syntax highlighting (recommended)
  :::

## Removed Components

### Typewriter → x-markdown-vue + enable-animate

The built-in `Typewriter` component has been removed in v2.0.0. Use `MarkdownRenderer` from `x-markdown-vue` with the `enable-animate` prop instead.

<!-- v1 code -->

```vue
<template>
  <Bubble :avatar="avatar" placement="start">
    <template #content>
      <Typewriter :content="content" />
    </template>
  </Bubble>
</template>

<script setup>
import { Bubble, Typewriter } from 'vue-element-plus-x';
</script>
```

<!-- v2 code -->

```vue
<template>
  <Bubble :avatar="avatar" placement="start">
    <template #content>
      <MarkdownRenderer :markdown="content" :enable-animate="true" />
    </template>
  </Bubble>
</template>

<script setup>
import { Bubble } from 'vue-element-plus-x';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';
</script>
```

### XMarkdown / XMarkdownAsync → MarkdownRenderer

`XMarkdown` and `XMarkdownAsync` are no longer bundled in v2.0.0. Use `MarkdownRenderer` from the standalone `x-markdown-vue` package.

<!-- v1 code -->

```vue
<template>
  <XMarkdown :content="content" />
</template>

<script setup>
import { XMarkdown } from 'vue-element-plus-x';
</script>
```

<!-- v2 code -->

```vue
<template>
  <MarkdownRenderer :markdown="content" />
</template>

<script setup>
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';
</script>
```

### Sender / MentionSender → XSender

`Sender` and `MentionSender` have been consolidated into `XSender`. Mention functionality is now configured through the `mentionConfig` prop.

<!-- v1 code -->

```vue
<template>
  <Sender v-model="value" placeholder="Type a message..." />
</template>

<script setup>
import { ref } from 'vue';
import { Sender } from 'vue-element-plus-x';

const value = ref('');
</script>
```

<!-- v2 code -->

```vue
<template>
  <XSender v-model="value" placeholder="Type a message..." />
</template>

<script setup>
import { ref } from 'vue';
import { XSender } from 'vue-element-plus-x';

const value = ref('');
</script>
```

#### MentionSender Migration

<!-- v1 code -->

```vue
<template>
  <MentionSender
    v-model="value"
    placeholder="@mention a user..."
    :mention-config="mentionConfig"
  />
</template>
```

<!-- v2 code -->

```vue
<template>
  <XSender
    v-model="value"
    placeholder="@mention a user..."
    :mention-config="mentionConfig"
  />
</template>
```

### EditorSender → XSender

::: info
`EditorSender` has been renamed to `XSender` with minor API changes. Make sure the underlying plugin version is greater than `1.3.98`.
:::

<!-- v1 code -->

```vue
<template>
  <EditorSender v-model="value" />
</template>

<script setup>
import { ref } from 'vue';
import { EditorSender } from 'vue-element-plus-x';

const value = ref('');
</script>
```

<!-- v2 code -->

```vue
<template>
  <XSender v-model="value" variant="default" />
</template>

<script setup>
import { ref } from 'vue';
import { XSender } from 'vue-element-plus-x';

const value = ref('');
</script>
```

## BubbleList Changes

### `triggerIndices` Prop Removed

The `triggerIndices` prop has been removed from the source code in v2.0.0. Please remove any related bindings from your templates.

<!-- v1 code -->

```vue
<BubbleList :list="list" :trigger-indices="'all'" />
```

<!-- v2 code -->

```vue
<BubbleList :list="list" />
```

### `@complete` Event Removed

The `@complete` event has been removed from the source code in v2.0.0. Please remove any related listeners from your templates.

<!-- v1 code -->

```vue
<BubbleList :list="list" @complete="onComplete" />
```

<!-- v2 code -->

```vue
<BubbleList :list="list" />
```

::: tip
In v2, the typing effect is no longer controlled by BubbleList. Instead, use the `#content` slot with `MarkdownRenderer`'s `enable-animate` prop. In streaming scenarios, simply **concatenate** characters returned by the backend into `item.content`, and `MarkdownRenderer` will automatically render incrementally.
:::

### Markdown Rendering Migration (#content Slot)

Since `triggerIndices` and `@complete` have been removed, v2 recommends using the `#content` slot with `MarkdownRenderer` for typewriter effects and Markdown rendering:

<!-- v1 code: BubbleList with built-in Typewriter -->

```vue
<template>
  <BubbleList :list="list" :trigger-indices="'all'" @complete="onComplete" />
</template>

<script setup>
import { BubbleList } from 'vue-element-plus-x';

const list = ref([
  { content: 'Hello!', placement: 'start', role: 'assistant' }
]);

const onComplete = (instance, index) => {
  console.log('Typing complete:', index);
};
</script>
```

<!-- v2 code: Use #content slot + MarkdownRenderer -->

```vue
<template>
  <BubbleList :list="list">
    <template #content="{ item }">
      <MarkdownRenderer :markdown="item.content" :enable-animate="true" />
    </template>
  </BubbleList>
</template>

<script setup>
import { ref } from 'vue';
import { BubbleList } from 'vue-element-plus-x';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const list = ref([
  { content: 'Hello!', placement: 'start', role: 'assistant' }
]);
</script>
```

### Streaming Rendering: Concatenating SSE Chars with hook-fetch

In v2, the recommended approach for streaming APIs (SSE) is: use `hook-fetch` to receive streaming data from the backend, **concatenate** each chunk of characters into the corresponding bubble's `content` field, and `MarkdownRenderer` will automatically render incrementally.

```vue
<template>
  <BubbleList :list="list">
    <template #content="{ item }">
      <MarkdownRenderer :markdown="item.content" :enable-animate="true" />
    </template>
  </BubbleList>
  <XSender v-model="inputValue" @submit="handleSend" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BubbleList, XSender } from 'vue-element-plus-x';
import { useHookFetch } from 'hook-fetch/vue';
import { sseTextDecoderPlugin } from 'hook-fetch/plugins/sse';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

interface MessageItem {
  role: 'user' | 'assistant';
  content: string;
  placement: 'start' | 'end';
}

const list = ref<MessageItem[]>([]);
const inputValue = ref('');

async function handleSend() {
  const userMsg = inputValue.value.trim();
  if (!userMsg) return;

  // Add user message
  list.value.push({ role: 'user', content: userMsg, placement: 'end' });

  // Add an empty AI message placeholder
  const aiIndex = list.value.length;
  list.value.push({ role: 'assistant', content: '', placement: 'start' });
  inputValue.value = '';

  // Use hook-fetch to make an SSE streaming request
  const { stream } = useHookFetch({
    url: '/api/chat',
    method: 'POST',
    body: JSON.stringify({ message: userMsg }),
    plugins: [sseTextDecoderPlugin()]
  });

  // Concatenate streaming chunks into the corresponding bubble's content
  for await (const chunk of stream()) {
    list.value[aiIndex].content += chunk.result ?? '';
  }
}
</script>
```

::: info

- `sseTextDecoderPlugin` decodes the SSE text stream — `chunk.result` is the parsed text fragment for each chunk
- Simply keep appending fragments to `item.content`, and `MarkdownRenderer` will handle incremental rendering and the typewriter effect automatically
- For more details on hook-fetch, see the [hook-fetch documentation](https://jsonlee12138.github.io/hook-fetch/)
  :::

## Hooks Changes

### usePrism Removed

`usePrism` has been removed in v2. Code highlighting is now provided by Shiki, which is built into `x-markdown-vue` — no additional configuration needed.

### useNamespace (Added)

An internal BEM namespace hook that provides CSS class name generation and variable binding. Generally, you don't need to use this directly in application code.

### useTheme (Added)

A theme variable management hook that provides reactive properties like `isDark` and `themeOverrides`. Typically used indirectly through the `ConfigProvider` component.

### useRecord (No Changes)

Speech recognition hook. API remains unchanged — you can continue using it as-is.

### useXStream (No Changes)

SSE streaming data processing hook. API remains unchanged — you can continue using it as-is.

### useSend (No Changes)

Frontend `loading` state management hook, independent of the request library. API remains unchanged — you can continue using it as-is.

### XRequest Deprecated

`XRequest` has been deprecated. [hook-fetch](https://jsonlee12138.github.io/hook-fetch/) is recommended as a replacement.

<!-- v1 code -->

```ts
import { XRequest } from 'vue-element-plus-x';

const request = new XRequest({
  baseURL: '/api',
  onMessage: msg => {
    // Handle streaming messages
  }
});
request.send('/chat');
```

<!-- v2 code -->

```ts
import { useHookFetch } from 'hook-fetch';

const { data, loading, send } = useHookFetch({
  url: '/api/chat'
  // See hook-fetch documentation
});
```

::: info
The `useSend` hook is still available. It is a wrapper for frontend `loading` state management and is independent of the request library.
:::

## New: ConfigProvider Theme System

### Basic Usage

`ConfigProvider` is a new global configuration component in v2 that controls theme mode and overrides theme variables.

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

### Dark Mode

Set `theme` to `'dark'` to enable dark mode. When enabled, a `dark` class is added to the `html` element.

```vue
<template>
  <ConfigProvider :theme="isDark ? 'dark' : 'light'">
    <App />
  </ConfigProvider>
</template>
```

### themeOverrides

Override `--elx-*` CSS variables via the `themeOverrides` prop:

```vue
<script setup lang="ts">
const themeOverrides = {
  common: {
    'color-primary': '#7c3aed'
  },
  components: {
    Welcome: {
      'welcome-filled-bg': '#f0f9ff',
      'welcome-title-color': 'rgba(0, 0, 0, 0.88)'
    }
  }
};
</script>
```

::: tip
For the full list of theme variables, see [Theme Tokens](/en/guide/theme-tokens).
:::

## CSS / Style Changes

### --elx-\* Variable Prefix

v2 uses `--elx-*` as the unified theme CSS variable prefix, distinct from Element Plus's `--el-*` prefix.

| Configuration                                         | Mapping                   |
| ----------------------------------------------------- | ------------------------- |
| `themeOverrides.common.color-primary`                 | `--elx-color-primary`     |
| `themeOverrides.common.bg-page`                       | `--elx-bg-page`           |
| `themeOverrides.components.Welcome.welcome-filled-bg` | `--elx-welcome-filled-bg` |

::: warning
The `namespace` prop only affects component class name prefixes. It does **not** affect theme CSS variable prefixes. Theme variables are always prefixed with `--elx-*`.
:::

### Dark Mode

Dark mode in v2 is controlled via the `theme` prop on `ConfigProvider`. You need to import the following styles in your project:

```ts
// main.ts
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vue-element-plus-x/styles/index.css';
```

## SSR Compatibility

v2 includes SSR compatibility improvements. If you use SSR deployment, mark the following packages as `noExternal` in your Vite config:

```ts
// vite.config.ts
export default defineConfig({
  ssr: {
    noExternal: [
      'vue-element-plus-x',
      'shiki',
      'shiki-stream',
      'x-markdown-vue'
    ]
  }
});
```

## Full Migration Example

Below is a minimal example showing a complete migration from v1 to v2:

<!-- v1 code -->

```vue
<template>
  <div class="chat-app">
    <BubbleList :list="list" />
    <MentionSender v-model="inputValue" @submit="handleSend" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { BubbleList, MentionSender } from 'vue-element-plus-x';

const list = ref([
  { content: 'Hello! How can I help you?', role: 'assistant' }
]);
const inputValue = ref('');

const handleSend = () => {
  list.value.push({ content: inputValue.value, role: 'user' });
  inputValue.value = '';
};
</script>
```

<!-- v2 code -->

```vue
<template>
  <ConfigProvider :theme="isDark ? 'dark' : 'light'">
    <div class="chat-app">
      <BubbleList :list="list">
        <template #content="{ item }">
          <MarkdownRenderer :markdown="item.content" :enable-animate="true" />
        </template>
      </BubbleList>
      <XSender
        v-model="inputValue"
        :mention-config="mentionConfig"
        @submit="handleSend"
      />
    </div>
  </ConfigProvider>
</template>

<script setup>
import { ref } from 'vue';
import { BubbleList, XSender, ConfigProvider } from 'vue-element-plus-x';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const isDark = ref(false);
const mentionConfig = ref({
  /* mention configuration */
});
const list = ref([
  { content: 'Hello! How can I help you?', role: 'assistant' }
]);
const inputValue = ref('');

const handleSend = () => {
  list.value.push({ content: inputValue.value, role: 'user' });
  inputValue.value = '';
};
</script>
```

## FAQ

### Q: Styles are broken after upgrading. What should I do?

A: Make sure you have imported the correct style files:

```ts
import 'element-plus/dist/index.css';
import 'vue-element-plus-x/styles/index.css';
```

If you are using dark mode, also import the Element Plus dark styles:

```ts
import 'element-plus/theme-chalk/dark/css-vars.css';
```

### Q: What are the differences between XSender and the old EditorSender?

A: `XSender` has minor API changes — mainly the rename, plus new props like `variant` for layout and `device` for device adaptation. For full API details, see the [XSender documentation](/en/components/xsender/).

### Q: How do I set up dark mode in VitePress?

A: See [Theme Configuration - VitePress Integration](/en/guide/theme#vitepress-integration).

### Q: Is XRequest still usable?

A: `XRequest` is currently still available but has been marked as deprecated. It is recommended to migrate to [hook-fetch](https://jsonlee12138.github.io/hook-fetch/), which provides more comprehensive request management capabilities.

### Q: Is the namespace configuration from the old version still valid?

A: The `namespace` prop is still available and only affects component class name prefixes. However, note that theme CSS variable prefixes are fixed as `--elx-*` and are not affected by `namespace`.
