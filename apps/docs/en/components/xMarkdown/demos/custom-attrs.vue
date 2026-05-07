<docs>
---
title: Custom Attributes
---

Add custom HTML attributes to any Markdown element via `custom-attrs`. Useful for styling or behavior customization.
</docs>

<script setup lang="ts">
import 'shiki';
import 'shiki-stream';

const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value = mod.MarkdownRenderer ?? mod.default ?? mod;
});

const content = `# First Heading (Blue)

## Second Heading (Green)

### Third Heading (Orange)

[External Link (opens in new tab)](https://github.com/element-plus-x)

![Image with lazy loading](https://via.placeholder.com/300x100)
`;

const customAttrs = {
  h1: { style: 'color: #3b82f6;' },
  h2: { style: 'color: #22c55e;' },
  h3: { style: 'color: #f97316;' },
  a: { target: '_blank', rel: 'noopener noreferrer' },
  img: { loading: 'lazy' }
};
</script>

<template>
  <component
    :is="MarkdownRenderer"
    v-if="MarkdownRenderer"
    :markdown="content"
    :custom-attrs="customAttrs"
  />
  <div v-else style="padding: 16px; color: #999">Loading...</div>
</template>
