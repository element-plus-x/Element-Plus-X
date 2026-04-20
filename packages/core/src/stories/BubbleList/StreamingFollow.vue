<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type {
  BubbleListInstance,
  BubbleListProps,
  BubbleListScrollState
} from '@components/BubbleList/types';
import BubbleList from '@components/BubbleList/index.vue';
import {
  createStoryMessage,
  createStorySeed,
  getLastMessageKey
} from './story-utils';

const props = withDefaults(
  defineProps<Partial<BubbleListProps<MessageItem>>>(),
  {
    list: () => []
  }
);

const STREAM_TICK_MS = 50;
const STREAM_CHARS_PER_TICK = 6;
const STREAM_TOTAL_TICKS = 200;

const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<MessageItem[]>([]);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const isStreaming = ref(false);
const streamTick = ref(0);
const emittedCharCount = ref(0);
const streamCharTotal = ref(0);
const round = ref(1);
const lastAction = ref(
  '点击"开始流式回复"，然后上滑观察跟随中断，回到底部观察自动恢复。'
);
let nextKey = 0;
let streamCharacters: string[] = [];
let streamOffset = 0;
let streamTimer: number | null = null;

function buildStreamingCharacters(currentRound: number) {
  const totalChars = STREAM_CHARS_PER_TICK * STREAM_TOTAL_TICKS;
  const paragraphs = Array.from({ length: STREAM_TOTAL_TICKS }, (_, index) => {
    const step = index + 1;
    return `第${currentRound}轮第${step}次增量输出，用来持续观察气泡内容变高时是否始终贴底，用户上滑后是否只累计未读而不打断阅读，重新回到底部以后是否立刻恢复自动跟随。`;
  });

  return Array.from(paragraphs.join('')).slice(0, totalChars);
}

function stopStreaming(reason = '已停止流式回复。') {
  if (streamTimer !== null) {
    window.clearInterval(streamTimer);
    streamTimer = null;
  }

  const lastItem = bubbleItems.value[bubbleItems.value.length - 1];
  if (lastItem?.role === 'ai') {
    lastItem.loading = false;
  }

  isStreaming.value = false;
  streamTimer = null;
  lastAction.value = reason;
}

function buildSeedList(source?: MessageItem[]) {
  const list = createStorySeed(
    source && source.length > 0 ? source : undefined,
    14,
    '流式预热'
  );

  nextKey = getLastMessageKey(list);
  round.value = 1;
  streamTick.value = 0;
  emittedCharCount.value = 0;
  streamCharTotal.value = 0;
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  isStreaming.value = false;
  lastAction.value =
    '点击“开始流式回复”，然后上滑观察跟随中断，回到底部观察自动恢复。';
  streamCharacters = [];
  streamOffset = 0;

  return list;
}

function resetConversation(source?: MessageItem[]) {
  stopStreaming('已重置当前流式会话。');
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
  streamTick.value = 0;
  emittedCharCount.value = 0;
  streamOffset = 0;

  bubbleItems.value.push(
    createStoryMessage(
      ++nextKey,
      'user',
      `第 ${currentRound} 轮提问：请总结 BubbleList 在流式输出与分页场景下的关键升级点。`
    )
  );

  streamCharacters = buildStreamingCharacters(currentRound);
  streamCharTotal.value = streamCharacters.length;

  const initialChunk = streamCharacters
    .slice(0, STREAM_CHARS_PER_TICK)
    .join('');
  streamOffset = initialChunk.length;
  emittedCharCount.value = streamOffset;
  streamTick.value = initialChunk.length > 0 ? 1 : 0;

  bubbleItems.value.push(
    createStoryMessage(++nextKey, 'ai', initialChunk, { loading: false })
  );

  isStreaming.value = true;
  lastAction.value = `流式输出进行中：每 ${STREAM_TICK_MS}ms 追加 ${STREAM_CHARS_PER_TICK} 个字，总量约 ${streamCharTotal.value} 字。`;

  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });

  streamTimer = window.setInterval(() => {
    const currentItem = bubbleItems.value[bubbleItems.value.length - 1];
    if (!currentItem || currentItem.role !== 'ai') {
      stopStreaming('流式消息已丢失，已终止当前模拟。');
      return;
    }

    if (
      streamOffset >= streamCharacters.length ||
      streamTick.value >= STREAM_TOTAL_TICKS
    ) {
      currentItem.loading = false;
      stopStreaming('流式输出完成。');
      return;
    }

    const nextChunk = streamCharacters
      .slice(streamOffset, streamOffset + STREAM_CHARS_PER_TICK)
      .join('');

    if (!nextChunk) {
      currentItem.loading = false;
      stopStreaming('流式输出完成。');
      return;
    }

    currentItem.loading = false;
    currentItem.content += nextChunk;
    streamOffset += nextChunk.length;
    emittedCharCount.value = streamOffset;
    streamTick.value += 1;

    if (
      streamOffset >= streamCharacters.length ||
      streamTick.value >= STREAM_TOTAL_TICKS
    ) {
      currentItem.loading = false;
      stopStreaming('流式输出完成。');
    }
  }, STREAM_TICK_MS);
}

function simulateInterrupt() {
  if (!bubbleListRef.value) {
    return;
  }

  bubbleListRef.value.scrollToTop(false);
  lastAction.value = '已滚动到顶部，新 chunk 将暂停跟随。回到底部后自动恢复。';
}

function resumeFollow() {
  bubbleListRef.value?.scrollToBottom(false);
  lastAction.value = '已回到底部，流式内容将持续跟随。';
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
  stopStreaming('组件卸载，已清理流式定时器。');
});
</script>

<template>
  <div class="demo-shell" data-testid="streaming-follow-demo">
    <div class="demo-head">
      <div class="demo-title">流式跟随 / 自动追底</div>
      <p class="demo-caption">
        默认行为：在底部时自动跟随流式内容；上滑后中断，回到底部后自动恢复。无需任何额外配置。
      </p>
    </div>

    <div class="toolbar-group">
      <div class="btn-list">
        <el-button
          size="small"
          data-testid="start-streaming"
          type="primary"
          plain
          :disabled="isStreaming"
          @click="startStreaming"
        >
          开始流式回复
        </el-button>
        <el-button
          size="small"
          data-testid="simulate-interrupt"
          type="warning"
          plain
          :disabled="!isStreaming"
          @click="simulateInterrupt"
        >
          滚动到顶部
        </el-button>
        <el-button
          size="small"
          data-testid="resume-follow"
          type="success"
          plain
          @click="resumeFollow"
        >
          回到底部
        </el-button>
        <el-button
          size="small"
          type="danger"
          plain
          :disabled="!isStreaming"
          @click="stopStreaming('已手动停止流式回复。')"
        >
          停止流式回复
        </el-button>
        <el-button size="small" type="info" plain @click="handleReset">
          重置会话
        </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-chip">
        <span>滚动状态</span>
        <strong data-testid="stream-scroll-state">{{ scrollState }}</strong>
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
        <strong data-testid="stream-char-progress"
          >{{ emittedCharCount }}/{{ streamCharTotal }}</strong
        >
      </div>
      <div class="status-chip">
        <span>已运行秒数</span>
        <strong data-testid="stream-tick-progress"
          >{{ streamTick }}/{{ STREAM_TOTAL_TICKS }}</strong
        >
      </div>
    </div>

    <div class="activity-bar">
      <span>最近动作</span>
      <strong>{{ lastAction }}</strong>
    </div>

    <div class="story-stage" data-testid="streaming-follow-stage">
      <BubbleList
        v-bind="props"
        ref="bubbleListRef"
        :list="bubbleItems"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      />
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
</style>
