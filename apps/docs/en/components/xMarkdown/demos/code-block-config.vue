<docs>
---
title: Code Block Configuration
---

Configure code block header visibility, max height, and sticky header behavior.
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
// A longer code block to demonstrate max height and line numbers
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: Date;
}

function createUser(data: Partial<User>): User {
  return {
    id: Math.floor(Math.random() * 10000),
    name: data.name ?? 'Anonymous',
    email: data.email ?? '',
    role: data.role ?? 'user',
    createdAt: new Date(),
  };
}

const user = createUser({ name: 'Alice', email: 'alice@example.com' });
console.log(user);
\`\`\``;

const showHeader = ref(true);
const stickyHeader = ref(false);
const codeMaxHeight = ref('200px');
const enableLineNumber = ref(true);

const rendererProps = computed(() => ({
  markdown: content,
  showCodeBlockHeader: showHeader.value,
  stickyCodeBlockHeader: stickyHeader.value,
  codeMaxHeight: codeMaxHeight.value,
  enableCodeLineNumber: enableLineNumber.value
}));
</script>

<template>
  <div>
    <div
      style="
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 12px;
        align-items: center;
      "
    >
      <el-checkbox v-model="showHeader"> Show Header </el-checkbox>
      <el-checkbox v-model="stickyHeader">
        Sticky Header (fixes on page scroll)
      </el-checkbox>
      <el-checkbox v-model="enableLineNumber"> Show Line Numbers </el-checkbox>
      <span>
        Max Height:
        <el-input v-model="codeMaxHeight" size="small" style="width: 100px" />
      </span>
    </div>
    <component
      :is="MarkdownRenderer"
      v-if="MarkdownRenderer"
      v-bind="rendererProps"
    />
    <div v-else style="padding: 16px; color: #999">Loading...</div>
  </div>
</template>
