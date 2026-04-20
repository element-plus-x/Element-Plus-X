<docs>
---
title: "Streaming Markdown Rendering (V2 Upgrade)"
---

Supports list rendering with formulas, code blocks, and task lists, and simulates real-time AI streaming Markdown output.

::: tip V2 Upgrade Notes
- **Streaming Follow**: V2 automatically sticks to the bottom during streaming output (as content grows taller). When the user scrolls up, following is interrupted; returning to the bottom resumes it automatically. V1 required manual scroll management.
- **Virtual Scroll Compatibility**: V2 virtual scroll + dynamic height measurement automatically re-measures item height when streaming content grows, preventing scroll position jumps.
- **State Awareness**: The `scroll-state-change` and `unread-count-change` events let you track scroll state changes in real time during streaming output.
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

// ---- Streaming related ----
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
  'Click "Start Streaming Markdown" to observe AI messages rendering incrementally with scroll following.'
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
      content: `### Inline Formulas
1. Euler's formula: $e^{i\\pi} + 1 = 0$
2. Quadratic formula: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$

### [] Wrapped Formula
\\[ e^{i\\pi} + 1 = 0 \\]
\\[\\boxed{boxed content}\\]`
    },
    {
      key: 2,
      role: 'user',
      placement: 'end',
      avatar: 'https://avatars.githubusercontent.com/u/1?s=40&v=4',
      content: 'How can I help you?'
    },
    {
      key: 3,
      role: 'ai',
      placement: 'start',
      avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
      content: `### Block Formulas & Code Block

Fourier Transform:
$$
F(\\omega) = \\int_{-\\infty}^{\\infty} f(t) e^{-i\\omega t} dt
$$

Matrix Multiplication:
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

Task List:
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
  return `### Round ${currentRound} Streaming Markdown Reply

This is a **streaming output + Markdown rendering** demo to verify V2 upgrade capabilities:

- Whether stick-to-bottom remains stable as output content grows taller
- Whether scrolling up only accumulates unread count without forcing a jump back
- Whether subsequent chunks continue auto-following after returning to the bottom

#### Structured Summary

1. BubbleList handles virtual scrolling and follow strategy.
2. MarkdownRenderer handles rich text rendering (headings, lists, code, formulas).
3. Together they cover long replies in real chat scenarios.

#### Code Snippet

\`\`\`ts
type StreamChunk = {
  text: string;
  index: number;
};

const followWhenAtBottom = (distance: number) => distance <= 4;
\`\`\`

#### Math Formula

$$
F(\\omega) = \\int_{-\\infty}^{\\infty} f(t)e^{-i\\omega t}\\,dt
$$

> Conclusion: When messages are incrementally updated, scroll boundary detection needs to account for status area height and tolerance.`;
}

function stopStreaming(reason = 'Streaming Markdown output stopped.') {
  if (streamTimer !== null) {
    window.clearInterval(streamTimer);
    streamTimer = null;
  }

  isStreaming.value = false;
  lastAction.value = reason;
}

function resetConversation() {
  stopStreaming('Current Markdown streaming session has been reset.');
  bubbleItems.value = buildStaticMessages();
  nextKey = 3;
  round.value = 1;
  emittedCharCount.value = 0;
  streamCharTotal.value = 0;
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  lastAction.value =
    'Click "Start Streaming Markdown" to observe AI messages rendering incrementally with scroll following.';
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

  // Append a user question first
  nextKey += 1;
  bubbleItems.value.push({
    key: nextKey,
    role: 'user',
    placement: 'end',
    avatar: 'https://avatars.githubusercontent.com/u/1?s=40&v=4',
    content: `Please explain the round ${currentRound} BubbleList streaming follow verification conclusion in Markdown.`
  });

  // Prepare streaming Markdown content
  const markdown = buildStreamingMarkdown(currentRound);
  streamCharacters = Array.from(markdown);
  streamCharTotal.value = streamCharacters.length;

  // Initial chunk
  const initialChunk = streamCharacters
    .slice(0, STREAM_CHARS_PER_TICK)
    .join('');
  streamOffset = initialChunk.length;
  emittedCharCount.value = streamOffset;

  // Append AI message (initial content)
  nextKey += 1;
  bubbleItems.value.push({
    key: nextKey,
    role: 'ai',
    placement: 'start',
    avatar: 'https://avatars.githubusercontent.com/u/76239030?s=40&v=4',
    content: initialChunk
  });

  isStreaming.value = true;
  lastAction.value = `Streaming Markdown in progress: appending ${STREAM_CHARS_PER_TICK} characters every ${STREAM_TICK_MS}ms.`;

  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });

  // Timed append
  streamTimer = window.setInterval(() => {
    const currentItem = bubbleItems.value[bubbleItems.value.length - 1];
    if (!currentItem || currentItem.role !== 'ai') {
      stopStreaming('Streaming message lost, simulation terminated.');
      return;
    }

    if (streamOffset >= streamCharacters.length) {
      stopStreaming('Streaming Markdown output complete.');
      return;
    }

    const nextChunk = streamCharacters
      .slice(streamOffset, streamOffset + STREAM_CHARS_PER_TICK)
      .join('');

    if (!nextChunk) {
      stopStreaming('Streaming Markdown output complete.');
      return;
    }

    currentItem.content += nextChunk;
    streamOffset += nextChunk.length;
    emittedCharCount.value = streamOffset;

    if (streamOffset >= streamCharacters.length) {
      stopStreaming('Streaming Markdown output complete.');
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
  stopStreaming('Component unmounted, Markdown streaming timer cleaned up.');
});
</script>

<template>
  <div class="markdown-demo-container">
    <div class="tip-banner">
      <span class="tip-icon">▶</span>
      <span
        >Click "Start Streaming Markdown" first, then try
        <strong>scrolling up</strong> to interrupt following, then click "Scroll
        to Bottom" to observe auto-resume.</span
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
          Start Streaming Markdown
        </el-button>
        <el-button
          type="warning"
          plain
          :disabled="!isStreaming"
          @click="bubbleListRef?.scrollToTop(false)"
        >
          Simulate Scroll Up
        </el-button>
        <el-button
          type="success"
          plain
          @click="bubbleListRef?.scrollToBottom(false)"
        >
          Scroll to Bottom
        </el-button>
        <el-button
          type="danger"
          plain
          :disabled="!isStreaming"
          @click="stopStreaming('Manually stopped')"
        >
          Stop Output
        </el-button>
        <el-button type="info" plain @click="resetConversation">
          Reset Session
        </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-chip">
        <span>Scroll State</span>
        <strong :class="`state-${scrollState.toLowerCase()}`">{{
          scrollState
        }}</strong>
      </div>
      <div class="status-chip">
        <span>Unread Count</span>
        <strong>{{ unreadCount }}</strong>
      </div>
      <div class="status-chip">
        <span>Stream Status</span>
        <strong :class="isStreaming ? 'streaming' : ''">{{
          isStreaming ? 'Outputting...' : 'Idle'
        }}</strong>
      </div>
      <div class="status-chip">
        <span>Chars Emitted</span>
        <strong>{{ emittedCharCount }}/{{ streamCharTotal }}</strong>
      </div>
      <div class="status-chip">
        <span>Current Round</span>
        <strong>{{ Math.max(round - 1, 0) }}</strong>
      </div>
    </div>

    <div class="activity-bar">
      <span>Last Action</span>
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
