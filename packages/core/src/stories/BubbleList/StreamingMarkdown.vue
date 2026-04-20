<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type {
  BubbleListInstance,
  BubbleListProps,
  BubbleListScrollState
} from '@components/BubbleList/types';
import BubbleList from '@components/BubbleList/index.vue';
import { MarkdownRenderer } from 'x-markdown-vue';
import {
  createStoryMessage,
  createStorySeed,
  getLastMessageKey
} from './story-utils';
import 'katex/dist/katex.min.css';

import 'shiki';
import 'shiki-stream';

const props = withDefaults(
  defineProps<Partial<BubbleListProps<MessageItem>>>(),
  {
    list: () => []
  }
);

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
  '点击“开始流式 Markdown”后，观察 AI 消息逐段渲染与滚动跟随效果。'
);

let nextKey = 0;
let streamCharacters: string[] = [];
let streamOffset = 0;
let streamTimer: number | null = null;

function buildStreamingMarkdown(currentRound: number) {
  return `### 第 ${currentRound} 轮流式 Markdown 回复

这是一个用于 Storybook 的 **流式输出 + Markdown 渲染** 演示，目标是验证：

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
F(\omega) = \int_{-\infty}^{\infty} f(t)e^{-i\omega t}\,dt
$$

> 结论：当消息是持续增量更新时，滚动边界判断需要考虑状态区高度与容差。`;
}

function stopStreaming(reason = '已停止流式 Markdown 输出。') {
  if (streamTimer !== null) {
    window.clearInterval(streamTimer);
    streamTimer = null;
  }

  const lastItem = bubbleItems.value[bubbleItems.value.length - 1];
  if (lastItem?.role === 'ai') {
    lastItem.loading = false;
  }

  isStreaming.value = false;
  lastAction.value = reason;
}

function buildSeedList(source?: MessageItem[]) {
  const list = createStorySeed(
    source && source.length > 0 ? source : undefined,
    8,
    'Markdown 流式预热'
  );

  nextKey = getLastMessageKey(list);
  round.value = 1;
  emittedCharCount.value = 0;
  streamCharTotal.value = 0;
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  isStreaming.value = false;
  lastAction.value =
    '点击“开始流式 Markdown”后，观察 AI 消息逐段渲染与滚动跟随效果。';
  streamCharacters = [];
  streamOffset = 0;

  return list;
}

function resetConversation(source?: MessageItem[]) {
  stopStreaming('已重置当前 Markdown 流式会话。');
  bubbleItems.value = buildSeedList(source);
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

function handleReset() {
  resetConversation(props.list as MessageItem[] | undefined);
}

function startStreaming() {
  if (isStreaming.value) {
    return;
  }

  const currentRound = round.value;
  round.value += 1;
  emittedCharCount.value = 0;
  streamOffset = 0;

  bubbleItems.value.push(
    createStoryMessage(
      ++nextKey,
      'user',
      `请用 Markdown 解释第 ${currentRound} 轮 BubbleList 流式跟随验证结论。`
    )
  );

  const markdown = buildStreamingMarkdown(currentRound);
  streamCharacters = Array.from(markdown);
  streamCharTotal.value = streamCharacters.length;

  const initialChunk = streamCharacters
    .slice(0, STREAM_CHARS_PER_TICK)
    .join('');
  streamOffset = initialChunk.length;
  emittedCharCount.value = streamOffset;

  bubbleItems.value.push(
    createStoryMessage(++nextKey, 'ai', initialChunk, { loading: false })
  );

  isStreaming.value = true;
  lastAction.value = `流式 Markdown 进行中：每 ${STREAM_TICK_MS}ms 追加 ${STREAM_CHARS_PER_TICK} 个字符。`;

  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });

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

    currentItem.loading = false;
    currentItem.content += nextChunk;
    streamOffset += nextChunk.length;
    emittedCharCount.value = streamOffset;

    if (streamOffset >= streamCharacters.length) {
      stopStreaming('流式 Markdown 输出完成。');
    }
  }, STREAM_TICK_MS);
}

function simulateInterrupt() {
  bubbleListRef.value?.scrollToTop(false);
  lastAction.value =
    '已模拟上滑中断，请继续观察后续 Markdown chunk 的跟随状态。';
}

function resumeFollow() {
  bubbleListRef.value?.scrollToBottom(false);
  lastAction.value = '已回到底部，后续 Markdown chunk 将恢复自动跟随。';
}

function handleScrollStateChange(state: BubbleListScrollState) {
  scrollState.value = state;
}

function handleUnreadCountChange(count: number) {
  unreadCount.value = count;
}

watch(
  () => props.list,
  source => {
    resetConversation(source as MessageItem[] | undefined);
  },
  { immediate: true }
);

onUnmounted(() => {
  stopStreaming('组件卸载，已清理 Markdown 流式定时器。');
});
</script>

<template>
  <div class="demo-shell" data-testid="streaming-markdown-demo">
    <div class="demo-head">
      <div class="demo-title">流式输出 / Markdown 渲染</div>
      <p class="demo-caption">
        这个 story 用于模拟 AI 逐段输出 Markdown，并在 BubbleList
        中实时渲染标题、列表、代码块和公式。
      </p>
    </div>

    <div class="toolbar-group">
      <div class="btn-list">
        <el-button
          size="small"
          type="primary"
          plain
          :disabled="isStreaming"
          @click="startStreaming"
        >
          开始流式 Markdown
        </el-button>
        <el-button
          size="small"
          type="warning"
          plain
          :disabled="!isStreaming"
          @click="simulateInterrupt"
        >
          模拟上滑中断
        </el-button>
        <el-button size="small" type="success" plain @click="resumeFollow">
          回到底部恢复
        </el-button>
        <el-button
          size="small"
          type="danger"
          plain
          :disabled="!isStreaming"
          @click="stopStreaming('已手动停止流式 Markdown 输出。')"
        >
          停止输出
        </el-button>
        <el-button size="small" type="info" plain @click="handleReset">
          重置会话
        </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-chip">
        <span>滚动状态</span>
        <strong>{{ scrollState }}</strong>
      </div>
      <div class="status-chip">
        <span>未读计数</span>
        <strong>{{ unreadCount }}</strong>
      </div>
      <div class="status-chip">
        <span>流式状态</span>
        <strong>{{ isStreaming ? '进行中' : '空闲' }}</strong>
      </div>
      <div class="status-chip">
        <span>当前轮次</span>
        <strong>{{ Math.max(round - 1, 0) }}</strong>
      </div>
      <div class="status-chip">
        <span>已输出字符</span>
        <strong>{{ emittedCharCount }}/{{ streamCharTotal }}</strong>
      </div>
    </div>

    <div class="activity-bar">
      <span>最近动作</span>
      <strong>{{ lastAction }}</strong>
    </div>

    <div class="story-stage">
      <BubbleList
        v-bind="props"
        ref="bubbleListRef"
        :list="bubbleItems"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <template #content="{ item }">
          <div v-if="item.role === 'ai'" class="markdown-content-wrapper">
            <MarkdownRenderer :markdown="item.content || ''" />
          </div>
          <span v-else>{{ item.content }}</span>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.demo-shell {
  display: grid;
  grid-template-rows: auto auto auto auto minmax(0, 1fr);
  gap: 10px;
  height: min(720px, calc(100vh - 16px));
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.demo-head {
  min-height: 0;
}

.demo-caption {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.45;
}

.demo-title,
.activity-bar strong {
  color: #1e3a8a;
  font-weight: 700;
  font-size: 16px;
}

.toolbar-group {
  min-height: 0;
}

.btn-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #dbeafe;

  span {
    font-size: 12px;
    color: #64748b;
    line-height: 1;
  }

  strong {
    font-size: 14px;
    color: #0f172a;
    line-height: 1;
  }
}

.activity-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
  border: 1px solid #dbeafe;

  span {
    font-size: 12px;
    color: #64748b;
  }
}

.story-stage {
  min-height: 0;
  height: 100%;
  padding: 10px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
}

.story-stage :deep(.elx-bubble-list) {
  width: 100%;
  height: 100%;
  min-height: 0;
  flex: 1 1 0;
  overflow: hidden;
}

.markdown-content-wrapper {
  word-break: break-word;

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4),
  :deep(h5),
  :deep(h6) {
    margin-top: 14px;
    margin-bottom: 8px;
    font-weight: 700;

    &:first-child {
      margin-top: 0;
    }
  }

  :deep(p) {
    margin: 0 0 8px;
    line-height: 1.6;
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 8px;
    padding-left: 20px;
  }

  :deep(code):not(pre code) {
    background-color: rgba(27, 31, 35, 0.08);
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 85%;
  }
}
</style>
