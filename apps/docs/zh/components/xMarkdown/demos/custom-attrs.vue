<docs>
---
title: 自定义属性
---

通过 `custom-attrs` 为特定 Markdown 元素添加 HTML 属性，如为链接添加 `target="_blank"`、为标题添加自定义 class 等。
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

const content = `# 一级标题（蓝色）

## 二级标题（绿色）

这是一个 [外部链接](https://github.com/element-plus-x/x-markdown)，会在新窗口打开。

![示例图片](https://picsum.photos/seed/elx/400/160)
`;

const customAttrs = {
  heading: (_node: any, { level }: { level: number }) => ({
    style:
      level === 1
        ? 'color: #409eff;'
        : level === 2
          ? 'color: #67c23a;'
          : undefined,
    class: `custom-heading-${level}`
  }),
  a: () => ({
    target: '_blank',
    rel: 'noopener noreferrer'
  }),
  img: () => ({
    loading: 'lazy',
    style: 'max-width: 100%; border-radius: 8px;'
  })
};
</script>

<template>
  <component
    :is="MarkdownRenderer"
    v-if="MarkdownRenderer"
    :markdown="content"
    :custom-attrs="customAttrs"
  />
  <div v-else style="padding: 16px; color: #999">加载中...</div>
</template>
