<docs>
---
title: 自定义代码块操作按钮
---

通过 `code-block-actions` 传入自定义按钮数组，可在代码块头部添加任意操作，按钮的 `show` 函数可控制其显示条件。
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

const content = `\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
console.log(greet('World'));
\`\`\`

\`\`\`python
def greet(name: str) -> str:
    return f"Hello, {name}!"

print(greet("World"))
\`\`\`
`;

const lastAction = ref('');

const codeBlockActions = [
  {
    key: 'run',
    title: '运行代码',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5z"/></svg>`,
    show: (props: any) =>
      ['typescript', 'ts', 'javascript', 'js'].includes(props.language),
    onClick: (props: any) => {
      lastAction.value = `运行了 ${props.language} 代码（${props.code.length} 字符）`;
    }
  },
  {
    key: 'insert',
    title: '插入到编辑器',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`,
    onClick: (props: any) => {
      lastAction.value = `已插入 ${props.language} 代码块到编辑器`;
    }
  }
];
</script>

<template>
  <div>
    <div
      v-if="lastAction"
      style="
        margin-bottom: 8px;
        padding: 8px 12px;
        background: #f0f9ff;
        border-radius: 4px;
        color: #0369a1;
        font-size: 13px;
      "
    >
      操作记录：{{ lastAction }}
    </div>
    <component
      :is="MarkdownRenderer"
      v-if="MarkdownRenderer"
      :markdown="content"
      :code-block-actions="codeBlockActions"
    />
    <div v-else style="padding: 16px; color: #999">加载中...</div>
  </div>
</template>
