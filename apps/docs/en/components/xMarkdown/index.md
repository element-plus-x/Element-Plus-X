---
title: XMarkdown
---

## Introduction

`x-markdown-vue` is a standalone Markdown rendering library extracted from `vue-element-plus-x`, designed for rich content display and streaming rendering in AI chat scenarios.

Starting from `v2.0.0`, the component library no longer bundles `Typewriter` / `XMarkdown` / `XMarkdownAsync`. If you need Markdown rendering, install it separately and integrate it in your app.

- NPM: [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)
- GitHub: [element-plus-x/x-markdown](https://github.com/element-plus-x/x-markdown)

## Installation

```bash
pnpm add x-markdown-vue
```

## Basic Usage

```vue
<template>
  <MarkdownRenderer :markdown="content" />
</template>

<script setup>
import { ref } from 'vue';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const content = ref('# Hello World\n\nThis is **Markdown** content');
</script>
```

## Working with Bubble / BubbleList

### Bubble

`Bubble` provides a `#content` slot, so you can render Markdown inside it:

- See: [Bubble](/en/components/bubble/#using-with-x-markdown-vue)

### BubbleList

`BubbleList` passes the current `item` in the `#content` slot props, so you can render Markdown for each message:

````vue
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
  { content: '## Title\n\n- Item 1\n- Item 2', placement: 'start' },
  { content: '```ts\nconsole.log(\"hello\")\n```', placement: 'end' }
]);
</script>
````
