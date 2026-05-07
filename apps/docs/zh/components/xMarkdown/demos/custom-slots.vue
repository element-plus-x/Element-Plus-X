<docs>
---
title: 自定义插槽
---

通过具名插槽自定义特定 Markdown 元素的渲染方式，可完全控制 HTML 输出结构和样式。
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

const content = `# 自定义标题插槽

## 二级标题

> 这是一段引用文字，将使用自定义引用块渲染，带有图标和渐变背景。

访问 [Element Plus X](https://github.com/element-plus-x) 了解更多。
`;
</script>

<template>
  <component :is="MarkdownRenderer" v-if="MarkdownRenderer" :markdown="content">
    <!-- 自定义标题：左侧彩色边框 -->
    <template #heading="{ level, children }">
      <component
        :is="`h${level}`"
        :style="{
          borderLeft: level === 1 ? '4px solid #409eff' : '3px solid #67c23a',
          paddingLeft: '12px',
          margin: '16px 0 8px'
        }"
      >
        <component :is="children" />
      </component>
    </template>

    <!-- 自定义引用块：渐变背景 + 图标 -->
    <template #blockquote="{ children }">
      <blockquote
        style="
          background: linear-gradient(135deg, #e8f4ff, #f0f8ff);
          border-left: 4px solid #409eff;
          border-radius: 0 8px 8px 0;
          padding: 12px 16px;
          margin: 8px 0;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        "
      >
        <span>💡</span>
        <div><component :is="children" /></div>
      </blockquote>
    </template>

    <!-- 自定义链接：新窗口 + 外链图标 -->
    <template #a="{ node, children }">
      <a
        :href="node?.properties?.href"
        target="_blank"
        rel="noopener noreferrer"
        style="
          color: #409eff;
          text-decoration: none;
          border-bottom: 1px dashed #409eff;
        "
      >
        <component :is="children" />↗
      </a>
    </template>
  </component>
  <div v-else style="padding: 16px; color: #999">加载中...</div>
</template>
