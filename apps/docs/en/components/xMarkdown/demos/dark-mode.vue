<docs>
---
title: Dark Mode
---

Use the `is-dark` prop to toggle between light and dark themes. Shiki syntax highlighting themes switch automatically.
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

const isDark = ref(false);

const content = `# Dark Mode Example

A code block with syntax highlighting:

\`\`\`typescript
const isDark: boolean = true;
const theme = isDark ? 'vitesse-dark' : 'vitesse-light';
console.log(\`Current theme: \${theme}\`);
\`\`\`

> In dark mode, the code highlighting theme switches automatically.
`;
</script>

<template>
  <div>
    <el-switch
      v-model="isDark"
      active-text="Dark"
      inactive-text="Light"
      style="margin-bottom: 12px"
    />
    <component
      :is="MarkdownRenderer"
      v-if="MarkdownRenderer"
      :markdown="content"
      :is-dark="isDark"
    />
    <div v-else style="padding: 16px; color: #999">Loading...</div>
  </div>
</template>
