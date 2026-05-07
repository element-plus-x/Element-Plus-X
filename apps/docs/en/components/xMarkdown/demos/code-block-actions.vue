<docs>
---
title: Custom Code Block Actions
---

Pass a `code-block-actions` array to add custom buttons to code block headers. Use `show` to conditionally display buttons.
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
    title: 'Run Code',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7L8 5z"/></svg>`,
    show: (props: any) =>
      ['typescript', 'ts', 'javascript', 'js'].includes(props.language),
    onClick: (props: any) => {
      lastAction.value = `Ran ${props.language} code (${props.code.length} chars)`;
    }
  },
  {
    key: 'insert',
    title: 'Insert to Editor',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>`,
    onClick: (props: any) => {
      lastAction.value = `Inserted ${props.language} code block to editor`;
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
      Action log: {{ lastAction }}
    </div>
    <component
      :is="MarkdownRenderer"
      v-if="MarkdownRenderer"
      :markdown="content"
      :code-block-actions="codeBlockActions"
    />
    <div v-else style="padding: 16px; color: #999">Loading...</div>
  </div>
</template>
