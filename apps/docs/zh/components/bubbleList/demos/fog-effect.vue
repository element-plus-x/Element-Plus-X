<docs>
---
title: 雾化效果
---

通过 `enable-animate` 属性实现打字机雾化效果，模拟 AI 流式输出场景。
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
    content: '你好！请帮我介绍一下 BubbleList 的雾化效果。',
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

const fullMarkdown = `### 雾化效果介绍

**雾化效果**（Fog / Animate）是 \`x-markdown-vue\` 的 \`MarkdownRenderer\` 提供的一种平滑过渡动画：

- 新增文字以**渐显**方式出现，而非生硬地追加
- 配合流式输出，能模拟 AI **逐段回复**的视觉体验
- 仅需设置 \`enable-animate\` 即可开启

#### 代码示例

\`\`\`vue
<MarkdownRenderer
  :markdown="content"
  :enable-animate="true"
/>
\`\`\`

#### 公式支持

行内公式 $E = mc^2$，块级公式同样适用：

$$
\\sum_{n=1}^{\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6}
$$

> 提示：雾化效果在流式场景下体验最佳，配合 BubbleList 自动追底使用更流畅。`;

function startStreaming() {
  if (isStreaming.value) return;

  // 重置 AI 消息
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
        开始流式输出
      </el-button>
      <el-button :disabled="!isStreaming" @click="stopStreaming">
        停止
      </el-button>
      <el-button @click="resetStreaming"> 重置 </el-button>
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
