<docs>
---
title: Basic Usage
---

Use `MarkdownRenderer` to render static Markdown content with GFM, task lists, tables, and syntax highlighting.
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

const content = `# Hello, Element Plus X 👋

This is **bold**, *italic*, ~~strikethrough~~ and \`inline code\`.

## Task List

- [x] Completed task
- [ ] Pending task

## Table

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| markdown | string | \`''\` | Markdown content |
| is-dark | boolean | \`false\` | Dark mode |
| enable-animate | boolean | \`false\` | Streaming animation |

## Code Block

\`\`\`typescript
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const messages: ChatMessage[] = [
  { role: 'user', content: 'Hello!' },
  { role: 'assistant', content: 'Hi! How can I help you?' },
];
\`\`\`
`;
</script>

<template>
  <component
    :is="MarkdownRenderer"
    v-if="MarkdownRenderer"
    :markdown="content"
  />
  <div v-else style="padding: 16px; color: #999">Loading...</div>
</template>
