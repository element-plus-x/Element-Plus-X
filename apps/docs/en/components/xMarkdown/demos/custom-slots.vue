<docs>
---
title: Custom Slots
---

Override Markdown element rendering using named slots for complete control over the HTML output.
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

const content = `# Custom Heading Slot

## Another Section Heading

> This is a blockquote styled with the custom slot.
> It demonstrates full rendering control.

[Click me](https://github.com/element-plus-x) — this link uses a custom slot.
`;
</script>

<template>
  <component :is="MarkdownRenderer" v-if="MarkdownRenderer" :markdown="content">
    <template #heading="{ children, depth }">
      <component
        :is="`h${depth}`"
        :style="{
          borderLeft: `4px solid ${['#3b82f6', '#22c55e', '#f97316'][depth - 1] || '#888'}`,
          paddingLeft: '12px',
          margin: '16px 0 8px'
        }"
      >
        <component :is="() => children" />
      </component>
    </template>
    <template #blockquote="{ children }">
      <blockquote
        style="
          background: linear-gradient(135deg, #eff6ff, #f0fdf4);
          border-left: 4px solid #3b82f6;
          padding: 12px 16px;
          border-radius: 0 8px 8px 0;
          margin: 12px 0;
        "
      >
        <component :is="() => children" />
      </blockquote>
    </template>
    <template #a="{ node, children }">
      <a
        :href="node.properties?.href as string"
        target="_blank"
        rel="noopener noreferrer"
        style="
          color: #7c3aed;
          text-decoration: none;
          border-bottom: 1px dashed #7c3aed;
        "
      >
        <component :is="() => children" />&#8599;
      </a>
    </template>
  </component>
  <div v-else style="padding: 16px; color: #999">Loading...</div>
</template>
