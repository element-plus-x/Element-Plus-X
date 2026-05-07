<docs>
---
title: 代码块配置
---

支持配置是否显示头部、最大高度、粘性头部等代码块相关选项。
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
// 一个较长的代码块，用于演示最大高度和行号效果
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
      <el-checkbox v-model="showHeader"> 显示头部 </el-checkbox>
      <el-checkbox v-model="stickyHeader">
        粘性头部（页面滚动时固定）
      </el-checkbox>
      <el-checkbox v-model="enableLineNumber"> 显示行号 </el-checkbox>
      <span>
        最大高度：
        <el-input v-model="codeMaxHeight" size="small" style="width: 100px" />
      </span>
    </div>
    <component
      :is="MarkdownRenderer"
      v-if="MarkdownRenderer"
      v-bind="rendererProps"
    />
    <div v-else style="padding: 16px; color: #999">加载中...</div>
  </div>
</template>
