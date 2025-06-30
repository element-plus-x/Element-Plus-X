<docs>
---
title: 支持 Markdown 内容渲染
---

通过 `isMarkdown` 属性控制是否启用 Markdown 渲染模式。
</docs>

<script setup lang="ts">
const markdownText = ref(`#### 标题 \n 这是一个 Markdown 示例。\n - 列表项 1 \n - 列表项 2 **粗体文本** 和 *斜体文本* \n \`\`\`javascript \n console.log('Hello, world!'); \n \`\`\``)
</script>

<template>
  <ClientOnly>
    <Typewriter :content="markdownText" :isMarkdown="true" />
  </ClientOnly>
</template>
