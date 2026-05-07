<docs>
---
title: 基础用法
---

使用 `MarkdownRenderer` 渲染静态 Markdown 内容，支持 GFM、任务列表、表格、代码高亮等。
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

这是 **加粗**、*斜体*、~~删除线~~ 和 \`行内代码\`。

## 任务列表

- [x] 已完成任务
- [ ] 待完成任务

## 表格

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| markdown | string | \`''\` | Markdown 内容 |
| is-dark | boolean | \`false\` | 深色模式 |
| enable-animate | boolean | \`false\` | 流式动画 |

## 代码块

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
  <div v-else style="padding: 16px; color: #999">加载中...</div>
</template>
