<docs>
---
title: 流式 Markdown 渲染（V2 升级）
---

支持公式、代码块、任务列表的列表渲染，并模拟 AI 逐段输出 Markdown 的实时效果。

::: tip V2 版本升级提示
- **流式跟随**：V2 在流式输出（内容持续变高）时，自动贴底跟随。用户上滑后中断，回到底部后自动恢复。V1 需要手动管理滚动位置。
- **虚拟滚动兼容**：V2 虚拟滚动 + 动态高度测量，流式变高时自动重新测量 item 高度，不会出现滚动位置跳动。
- **状态感知**：通过 `scroll-state-change` 和 `unread-count-change` 事件可实时感知流式输出期间的滚动状态变化。
:::
</docs>

<script setup lang="ts">
import type {
  BubbleListInstance,
  BubbleListScrollState
} from 'vue-element-plus-x/types/BubbleList';
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

interface MessageItem {
  key: number;
  role: 'user' | 'ai' | 'system';
  placement: 'start' | 'end';
  content: string;
  avatar: string;
}

// ---- 流式输出相关 ----
const STREAM_TICK_MS = 70;
const STREAM_CHARS_PER_TICK = 8;

const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<MessageItem[]>([]);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const isStreaming = ref(false);
const emittedCharCount = ref(0);
const streamCharTotal = ref(0);
const round = ref(1);
const lastAction = ref(
  '点击"开始流式 Markdown"，观察 AI 消息逐段渲染与滚动跟随效果。'
);

let nextKey = 0;
let streamCharacters: string[] = [];
let streamOffset = 0;
let streamTimer: number | null = null;

function buildStaticMessages(): MessageItem[] {
  return [
    {
      key: 1,
      role: 'ai',
      placement: 'start',
      avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
      content: `### 行内公式
1. 欧拉公式：$e^{i\\pi} + 1 = 0$
2. 二次方程求根公式：$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

### []包裹公式
\\[ e^{i\\pi} + 1 = 0 \\]
\\[\\boxed{boxed包裹}\\]`
    },
    {
      key: 2,
      role: 'user',
      placement: 'end',
      avatar: 'https://avatars.githubusercontent.com/u/1?s=40&v=4',
      content: '请问有什么可以帮助您的？'
    },
    {
      key: 3,
      role: 'ai',
      placement: 'start',
      avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
      content: `### 块级公式与代码块

傅里叶变换：
$$
F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt
$$

矩阵乘法：
$$
\\begin{bmatrix}
a & b \\\\
c & d
\\end{bmatrix}
\\begin{bmatrix}
x \\\\
y
\\end{bmatrix}
=
\\begin{bmatrix}
ax + by \\\\
cx + dy
\\end{bmatrix}
$$

任务列表：
- [x] Add some task
- [ ] Do some task

\`\`\`typescript
const greeting: string = "Hello World";
console.log(greeting);
\`\`\``
    }
  ];
}

function buildStreamingMarkdown(currentRound: number): string {
  return `### 第 ${currentRound} 轮流式 Markdown 回复

这是一个 **流式输出 + Markdown 渲染** 演示，验证 V2 升级后的能力：

- 输出内容持续变高时，贴底状态是否稳定
- 用户上滑后，是否只累计未读而不强制跳回
- 回到底部后，后续 chunk 是否继续自动跟随

#### 结构化摘要

1. BubbleList 负责虚拟滚动与跟随策略。
2. MarkdownRenderer 负责富文本渲染（标题、列表、代码、公式）。
3. 两者结合后可覆盖真实聊天场景中的长回复。

#### 代码片段

\`\`\`ts
type StreamChunk = {
  text: string;
  index: number;
};

const followWhenAtBottom = (distance: number) => distance <= 4;
\`\`\`

#### 数学公式

$$
F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)e^{-i\\omega t}\\,dt
$$

> 结论：当消息是持续增量更新时，滚动边界判断需要考虑状态区高度与容差。`;
}

function stopStreaming(reason = '已停止流式 Markdown 输出。') {
  if (streamTimer !== null) {
    window.clearInterval(streamTimer);
    streamTimer = null;
  }

  isStreaming.value = false;
  lastAction.value = reason;
}

function resetConversation() {
  stopStreaming('已重置当前 Markdown 流式会话。');
  bubbleItems.value = buildStaticMessages();
  nextKey = 3;
  round.value = 1;
  emittedCharCount.value = 0;
  streamCharTotal.value = 0;
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  lastAction.value =
    '点击"开始流式 Markdown"，观察 AI 消息逐段渲染与滚动跟随效果。';
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

function startStreaming() {
  if (isStreaming.value) return;

  const currentRound = round.value;
  round.value += 1;
  emittedCharCount.value = 0;
  streamOffset = 0;

  // 先追加一条用户提问
  nextKey += 1;
  bubbleItems.value.push({
    key: nextKey,
    role: 'user',
    placement: 'end',
    avatar: 'https://avatars.githubusercontent.com/u/1?s=40&v=4',
    content: `请用 Markdown 解释第 ${currentRound} 轮 BubbleList 流式跟随验证结论。`
  });

  // 准备流式 Markdown 内容
  const markdown = buildStreamingMarkdown(currentRound);
  streamCharacters = Array.from(markdown);
  streamCharTotal.value = streamCharacters.length;

  // 初始 chunk
  const initialChunk = streamCharacters
    .slice(0, STREAM_CHARS_PER_TICK)
    .join('');
  streamOffset = initialChunk.length;
  emittedCharCount.value = streamOffset;

  // 追加 AI 消息（初始内容）
  nextKey += 1;
  bubbleItems.value.push({
    key: nextKey,
    role: 'ai',
    placement: 'start',
    avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
    content: initialChunk
  });

  isStreaming.value = true;
  lastAction.value = `流式 Markdown 进行中：每 ${STREAM_TICK_MS}ms 追加 ${STREAM_CHARS_PER_TICK} 个字符。`;

  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });

  // 定时追加
  streamTimer = window.setInterval(() => {
    const currentItem = bubbleItems.value[bubbleItems.value.length - 1];
    if (!currentItem || currentItem.role !== 'ai') {
      stopStreaming('流式消息已丢失，已终止当前模拟。');
      return;
    }

    if (streamOffset >= streamCharacters.length) {
      stopStreaming('流式 Markdown 输出完成。');
      return;
    }

    const nextChunk = streamCharacters
      .slice(streamOffset, streamOffset + STREAM_CHARS_PER_TICK)
      .join('');

    if (!nextChunk) {
      stopStreaming('流式 Markdown 输出完成。');
      return;
    }

    currentItem.content += nextChunk;
    streamOffset += nextChunk.length;
    emittedCharCount.value = streamOffset;

    if (streamOffset >= streamCharacters.length) {
      stopStreaming('流式 Markdown 输出完成。');
    }
  }, STREAM_TICK_MS);
}

function handleScrollStateChange(state: BubbleListScrollState) {
  scrollState.value = state;
}

function handleUnreadCountChange(count: number) {
  unreadCount.value = count;
}

onMounted(() => {
  resetConversation();
});

onUnmounted(() => {
  stopStreaming('组件卸载，已清理 Markdown 流式定时器。');
});
</script>

<template>
  <div class="markdown-demo-container">
    <div class="tip-banner">
      <span class="tip-icon">▶</span>
      <span
        >先点击"开始流式
        Markdown"，然后尝试<strong>向上滚动</strong>打断跟随，再点"回到底部恢复"观察自动恢复。</span
      >
    </div>

    <div class="toolbar">
      <div class="btn-list">
        <el-button
          type="primary"
          plain
          :disabled="isStreaming"
          @click="startStreaming"
        >
          开始流式 Markdown
        </el-button>
        <el-button
          type="warning"
          plain
          :disabled="!isStreaming"
          @click="bubbleListRef?.scrollToTop(false)"
        >
          模拟上滑中断
        </el-button>
        <el-button
          type="success"
          plain
          @click="bubbleListRef?.scrollToBottom(false)"
        >
          回到底部恢复
        </el-button>
        <el-button
          type="danger"
          plain
          :disabled="!isStreaming"
          @click="stopStreaming('已手动停止')"
        >
          停止输出
        </el-button>
        <el-button type="info" plain @click="resetConversation">
          重置会话
        </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-chip">
        <span>滚动状态</span>
        <strong :class="`state-${scrollState.toLowerCase()}`">{{
          scrollState
        }}</strong>
      </div>
      <div class="status-chip">
        <span>未读计数</span>
        <strong>{{ unreadCount }}</strong>
      </div>
      <div class="status-chip">
        <span>流式状态</span>
        <strong :class="isStreaming ? 'streaming' : ''">{{
          isStreaming ? '输出中...' : '空闲'
        }}</strong>
      </div>
      <div class="status-chip">
        <span>已输出字符</span>
        <strong>{{ emittedCharCount }}/{{ streamCharTotal }}</strong>
      </div>
      <div class="status-chip">
        <span>当前轮次</span>
        <strong>{{ Math.max(round - 1, 0) }}</strong>
      </div>
    </div>

    <div class="activity-bar">
      <span>最近动作</span>
      <strong>{{ lastAction }}</strong>
    </div>

    <div class="story-stage">
      <BubbleList
        ref="bubbleListRef"
        :list="bubbleItems"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <template #content="{ item }">
          <div v-if="item.role === 'ai'" class="markdown-content-wrapper">
            <component
              :is="MarkdownRenderer"
              v-if="MarkdownRenderer"
              :markdown="item.content || ''"
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
.markdown-demo-container {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .story-stage {
    height: 450px;
    padding: 8px 10px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }

  .tip-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 8px;
    background: linear-gradient(135deg, #ecf5ff 0%, #fef0f0 100%);
    border: 1px solid #d9ecff;
    font-size: 13px;
    color: #409eff;

    .tip-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #409eff;
      color: #fff;
      font-size: 11px;
      flex-shrink: 0;
    }

    strong {
      color: #f56c6c;
    }
  }

  .toolbar {
    .btn-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  }

  .status-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 32px;
    padding: 0 12px;
    border-radius: 999px;
    background: #fff;
    border: 1px solid #e4e7ed;

    span {
      font-size: 12px;
      color: #909399;
    }
    strong {
      font-size: 13px;
      color: #303133;
    }

    .state-at_bottom {
      color: #67c23a;
    }
    .state-scrolled_up {
      color: #e6a23c;
    }
    .state-has_new_messages {
      color: #f56c6c;
    }
    .streaming {
      color: #409eff;
      animation: blink 1s ease-in-out infinite;
    }
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  .activity-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 999px;
    background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
    border: 1px solid #dbeafe;

    span {
      font-size: 12px;
      color: #909399;
    }
    strong {
      font-size: 13px;
      color: #1e3a8a;
    }
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
    ul,
    ol {
      margin-top: 4px;
      margin-bottom: 0;
    }
  }

  :deep(ul) {
    list-style-type: disc;
  }
  :deep(ol) {
    list-style-type: decimal;
  }

  :deep(li) {
    margin: 4px 0;
    line-height: 1.6;
    &.task-list-item {
      list-style-type: none;
      padding-left: 0;
      display: flex;
      align-items: flex-start;
      margin-left: -20px;
      input[type='checkbox'] {
        margin: 5px 8px 0 0;
        flex-shrink: 0;
      }
    }
  }

  :deep(a) {
    color: #0366d6;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  :deep(code):not(pre code) {
    background-color: rgba(27, 31, 35, 0.05);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 85%;
  }

  :deep(blockquote) {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    margin: 0 0 8px 0;
  }

  :deep(hr) {
    height: 0.25em;
    padding: 0;
    margin: 16px 0;
    background-color: #e1e4e8;
    border: 0;
  }

  :deep(table) {
    display: block;
    width: 100%;
    overflow: auto;
    margin-top: 0;
    margin-bottom: 16px;
    border-collapse: collapse;
    th,
    td {
      padding: 6px 13px;
      border: 1px solid #dfe2e5;
    }
    tr {
      background-color: #fff;
      border-top: 1px solid #c6cbd1;
      &:nth-child(2n) {
        background-color: #f6f8fa;
      }
    }
  }
}

:deep(.x-md-code-block) {
  pre {
    background-color: #f6f8fa !important;
    padding: 16px;
    border-radius: 8px;
    overflow: auto;
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
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
