<docs>
---
title: Custom Code Block Renderer
---

Use `code-x-render` to replace the default code block renderer for specific languages with a fully custom component.
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

const content = `\`\`\`json
{
  "name": "element-plus-x",
  "version": "2.0.0",
  "description": "An AI component library for Vue 3",
  "keywords": ["vue", "ai", "chat", "markdown"],
  "license": "MIT"
}
\`\`\`

\`\`\`typescript
// TypeScript code blocks still render normally
const msg: string = 'Hello, World!';
console.log(msg);
\`\`\`
`;

function codeXRender(props: { language: string; code: string }) {
  if (props.language !== 'json') return null;
  let parsed: any;
  try {
    parsed = JSON.parse(props.code);
  } catch {
    return h('pre', { style: 'color: red;' }, 'Invalid JSON');
  }
  const entries = Object.entries(parsed);
  return h(
    'div',
    {
      style:
        'border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden; font-family: monospace; font-size: 13px;'
    },
    [
      h(
        'div',
        {
          style:
            'background: #f3f4f6; padding: 6px 12px; font-size: 12px; color: #6b7280; border-bottom: 1px solid #e5e7eb;'
        },
        'JSON Viewer'
      ),
      h(
        'div',
        { style: 'padding: 12px;' },
        entries.map(([key, val]) =>
          h('div', { style: 'display: flex; gap: 8px; padding: 3px 0;' }, [
            h(
              'span',
              { style: 'color: #9333ea; min-width: 120px;' },
              `"${key}"`
            ),
            h('span', { style: 'color: #6b7280;' }, ':'),
            h(
              'span',
              {
                style: `color: ${typeof val === 'string' ? '#16a34a' : '#2563eb'};`
              },
              typeof val === 'string'
                ? `"${val}"`
                : Array.isArray(val)
                  ? `[${(val as string[]).join(', ')}]`
                  : String(val)
            )
          ])
        )
      )
    ]
  );
}
</script>

<template>
  <component
    :is="MarkdownRenderer"
    v-if="MarkdownRenderer"
    :markdown="content"
    :code-x-render="codeXRender"
  />
  <div v-else style="padding: 16px; color: #999">Loading...</div>
</template>
