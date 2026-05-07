<docs>
---
title: 流式渲染动画
---

开启 `enable-animate` 后，新增内容将以逐字淡入动画效果呈现，非常适合 AI 流式输出场景。
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

const fullText = `# AI 助手回复

正在流式输出 Markdown 内容...

- 支持 **加粗** 和 *斜体*
- 支持 \`行内代码\`
- 支持任务列表

- [x] 已完成的步骤
- [ ] 待处理的任务

\`\`\`typescript
const greeting: string = 'Hello World';
console.log(greeting);
\`\`\`
`;

const streamContent = ref('');
let intervalId: ReturnType<typeof setInterval> | null = null;
const isStreaming = ref(false);

function startStream() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  streamContent.value = '';
  isStreaming.value = true;
  let index = 0;
  intervalId = setInterval(() => {
    if (index < fullText.length) {
      streamContent.value += fullText[index++];
    } else {
      clearInterval(intervalId!);
      intervalId = null;
      isStreaming.value = false;
    }
  }, 30);
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});
</script>

<template>
  <div>
    <el-button
      type="primary"
      :loading="isStreaming"
      style="margin-bottom: 12px"
      @click="startStream"
    >
      {{ isStreaming ? '输出中...' : '开始流式输出' }}
    </el-button>
    <component
      :is="MarkdownRenderer"
      v-if="MarkdownRenderer"
      :markdown="streamContent"
      :enable-animate="true"
    />
    <div v-else style="padding: 16px; color: #999">加载中...</div>
  </div>
</template>
