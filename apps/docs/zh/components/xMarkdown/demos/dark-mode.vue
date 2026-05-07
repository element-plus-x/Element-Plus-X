<docs>
---
title: 深色模式
---

通过 `is-dark` prop 切换深浅色主题，代码块语法高亮主题也会随之自动切换。
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

const content = `# 深色模式示例

这是一段带有代码块的内容：

\`\`\`typescript
const isDark: boolean = true;
const theme = isDark ? 'vitesse-dark' : 'vitesse-light';
console.log(\`当前高亮主题：\${theme}\`);
\`\`\`

> 深色模式下，代码高亮主题也会自动切换为深色风格。
`;
</script>

<template>
  <div>
    <el-switch
      v-model="isDark"
      active-text="深色"
      inactive-text="浅色"
      style="margin-bottom: 12px"
    />
    <component
      :is="MarkdownRenderer"
      v-if="MarkdownRenderer"
      :markdown="content"
      :is-dark="isDark"
    />
    <div v-else style="padding: 16px; color: #999">加载中...</div>
  </div>
</template>
