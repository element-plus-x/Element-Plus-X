<docs>
---
title: Streaming Animation
---

Enable `enable-animate` to add a fade-in animation for each newly appended token — ideal for AI streaming output.
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

const fullText = `# AI Assistant Reply

Streaming Markdown content in real-time...

- Supports **bold** and *italic*
- Supports \`inline code\`
- Supports task lists

- [x] Completed step
- [ ] Pending task

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
      {{ isStreaming ? 'Streaming...' : 'Start Streaming' }}
    </el-button>
    <component
      :is="MarkdownRenderer"
      v-if="MarkdownRenderer"
      :markdown="streamContent"
      :enable-animate="true"
    />
    <div v-else style="padding: 16px; color: #999">Loading...</div>
  </div>
</template>
