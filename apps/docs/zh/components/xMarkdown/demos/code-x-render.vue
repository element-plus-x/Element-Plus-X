<docs>
---
title: 自定义代码块渲染器
---

通过 `code-x-render` 对特定语言的代码块进行完全自定义渲染，适用于 JSON 可视化、图表渲染等场景。
</docs>

<script setup lang="ts">
import { h } from 'vue';
import 'shiki';
import 'shiki-stream';

const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value = mod.MarkdownRenderer ?? mod.default ?? mod;
});

const content = `以下 JSON 块将使用自定义渲染器展示：

\`\`\`json
{
  "name": "element-plus-x",
  "version": "2.0.0",
  "description": "Vue 3 AI 组件库",
  "keywords": ["vue", "ai", "markdown", "chat"],
  "dependencies": {
    "x-markdown-vue": "^1.0.0"
  }
}
\`\`\`

普通代码块不受影响：

\`\`\`typescript
console.log('Hello World');
\`\`\`
`;

const codeXRender = {
  json: (props: any) => {
    try {
      const formatted = JSON.stringify(JSON.parse(props.raw.content), null, 2);
      return h(
        'div',
        {
          style: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: '8px',
            padding: '16px',
            fontFamily: 'monospace',
            fontSize: '13px',
            lineHeight: '1.6',
            overflow: 'auto',
            color: '#a8ff78',
            border: '1px solid #2d2d5e'
          }
        },
        [
          h(
            'div',
            { style: 'color: #888; margin-bottom: 8px; font-size: 11px;' },
            '📋 JSON 查看器'
          ),
          h('pre', { style: 'margin: 0; white-space: pre-wrap;' }, formatted)
        ]
      );
    } catch {
      return null;
    }
  }
};
</script>

<template>
  <component
    :is="MarkdownRenderer"
    v-if="MarkdownRenderer"
    :markdown="content"
    :code-x-render="codeXRender"
  />
  <div v-else style="padding: 16px; color: #999">加载中...</div>
</template>
