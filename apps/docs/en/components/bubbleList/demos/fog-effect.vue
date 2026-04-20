<docs>
---
title: Fog Effect
---

Enable the typewriter fog animation via the `enable-animate` prop to simulate AI streaming output.
</docs>

<script setup lang="ts">
import 'katex/dist/katex.min.css';
import 'shiki';
import 'shiki-stream';

const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value = mod.MarkdownRenderer ?? mod.default ?? mod;
});

const STREAM_TICK_MS = 50;
const STREAM_CHARS_PER_TICK = 6;

const list = ref([
  {
    key: '1',
    content: 'Hi! Can you introduce the fog effect in BubbleList?',
    placement: 'end' as const,
    avatar: 'https://avatars.githubusercontent.com/u/1?s=40&v=4',
    role: 'user'
  },
  {
    key: '2',
    content: '',
    placement: 'start' as const,
    avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
    role: 'ai'
  }
]);

const isStreaming = ref(false);
let streamTimer: number | null = null;
let streamCharacters: string[] = [];
let streamOffset = 0;

const fullMarkdown = `### Fog Effect Introduction

The **Fog Effect** (animate) is a smooth transition animation provided by \`x-markdown-vue\`'s \`MarkdownRenderer\`:

- New text appears with a **fade-in** effect instead of being appended abruptly
- Combined with streaming output, it simulates an AI **incremental reply** visual experience
- Simply set \`enable-animate\` to enable it

#### Code Example

\`\`\`vue
<MarkdownRenderer
  :markdown="content"
  :enable-animate="true"
/>
\`\`\`

#### Formula Support

Inline formula $E = mc^2$, block formulas work as well:

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$

> Tip: The fog effect works best in streaming scenarios and is even smoother when used with BubbleList auto-scroll.`;

function startStreaming() {
  if (isStreaming.value) return;

  list.value[1].content = '';
  streamOffset = 0;
  streamCharacters = Array.from(fullMarkdown);

  const initialChunk = streamCharacters
    .slice(0, STREAM_CHARS_PER_TICK)
    .join('');
  streamOffset = initialChunk.length;
  list.value[1].content = initialChunk;
  isStreaming.value = true;

  streamTimer = window.setInterval(() => {
    if (streamOffset >= streamCharacters.length) {
      stopStreaming();
      return;
    }
    const nextChunk = streamCharacters
      .slice(streamOffset, streamOffset + STREAM_CHARS_PER_TICK)
      .join('');
    list.value[1].content += nextChunk;
    streamOffset += nextChunk.length;

    if (streamOffset >= streamCharacters.length) {
      stopStreaming();
    }
  }, STREAM_TICK_MS);
}

function stopStreaming() {
  if (streamTimer !== null) {
    window.clearInterval(streamTimer);
    streamTimer = null;
  }
  isStreaming.value = false;
}

function resetStreaming() {
  stopStreaming();
  list.value[1].content = '';
}

onMounted(() => {
  startStreaming();
});

onUnmounted(() => {
  stopStreaming();
});
</script>

<template>
  <div class="fog-demo-container">
    <div class="btn-list">
      <el-button type="primary" :disabled="isStreaming" @click="startStreaming">
        Start Streaming
      </el-button>
      <el-button :disabled="!isStreaming" @click="stopStreaming">
        Stop
      </el-button>
      <el-button @click="resetStreaming"> Reset </el-button>
    </div>

    <div class="list-stage">
      <BubbleList :list="list" max-height="420px">
        <template #content="{ item }">
          <div v-if="item.role === 'ai'" class="markdown-content-wrapper">
            <component
              :is="MarkdownRenderer"
              v-if="MarkdownRenderer"
              :markdown="item.content || ''"
              :enable-animate="true"
            />
            <pre v-else>{{ item.content }}</pre>
          </div>
          <span v-else>{{ item.content }}</span>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.fog-demo-container {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .btn-list {
    display: flex;
    gap: 12px;
  }

  .list-stage {
    height: 420px;
    padding: 8px 10px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }
}

.markdown-content-wrapper {
  word-break: break-word;
  color: #24292e;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: 600;
    line-height: 1.25;
    &:first-child {
      margin-top: 0;
    }
  }

  :deep(p) {
    margin-top: 0;
    margin-bottom: 8px;
    line-height: 1.6;
    &:last-child {
      margin-bottom: 0;
    }
  }

  :deep(ul),
  :deep(ol) {
    padding-left: 20px;
    margin-top: 0;
    margin-bottom: 8px;
  }

  :deep(ul) {
    list-style-type: disc;
  }

  :deep(li) {
    margin: 4px 0;
    line-height: 1.6;
  }

  :deep(code):not(pre code) {
    background-color: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family:
      ui-monospace,
      SFMono-Regular,
      SF Mono,
      Menlo,
      Consolas,
      monospace;
    font-size: 85%;
  }

  :deep(blockquote) {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    margin: 0 0 8px 0;
  }
}

:deep(.x-md-code-block) {
  pre {
    background-color: #f6f8fa !important;
    padding: 16px;
    border-radius: 8px;
    overflow: auto;

    code {
      font-family:
        ui-monospace,
        SFMono-Regular,
        SF Mono,
        Menlo,
        Consolas,
        monospace;
      font-size: 14px;
      line-height: 1.5;

      .line {
        display: block;
        min-height: 1rem;
      }
    }
  }
}
</style>
