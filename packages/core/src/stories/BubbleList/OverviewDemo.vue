<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type {
  BubbleListBoundaryState,
  BubbleListInstance,
  BubbleListItemContext,
  BubbleListProps,
  BubbleListScrollState
} from '@components/BubbleList/types';
import BubbleList from '@components/BubbleList/index.vue';
import {
  createStoryMessage,
  createStorySeed,
  createStorySequence,
  getLastMessageKey
} from './story-utils';

type TimelineItem = MessageItem & {
  role: MessageItem['role'] | 'system';
  itemType?: 'date-divider' | 'history-divider' | 'system-tip';
  tone?: 'info' | 'success' | 'warning';
};

const props = withDefaults(
  defineProps<Partial<BubbleListProps<TimelineItem>>>(),
  {
    list: () => []
  }
);

const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<TimelineItem[]>([]);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const topStatus = ref<BubbleListBoundaryState | null>(null);
const bottomStatus = ref<BubbleListBoundaryState | null>(null);
const historyBatchCount = ref(0);
const bottomBatchCount = ref(0);
const isStreaming = ref(false);
const streamProgress = ref(0);
const activity = ref(
  '这里专门验收复杂时间线：流式续写、特殊节点、双向加载和回底协同。'
);

const STREAM_TICK_MS = 50;
const STREAM_CHARS_PER_TICK = 6;
const STREAM_TOTAL_TICKS = 80;
const MAX_HISTORY_BATCHES = 2;
const MAX_BOTTOM_BATCHES = 2;
const PAGE_SIZE = 4;

let nextKey = 0;
let streamOffset = 0;
let streamCharacters: string[] = [];
let streamTimer: number | null = null;
let topTimer: number | null = null;
let bottomTimer: number | null = null;

function createNode(
  itemType: TimelineItem['itemType'],
  content: string,
  tone: TimelineItem['tone'] = 'info'
): TimelineItem {
  nextKey += 1;

  return {
    key: nextKey,
    role: 'system',
    itemType,
    tone,
    content,
    placement: 'start',
    avatar: '',
    noStyle: true
  };
}

function buildSeedList(source?: TimelineItem[]) {
  const base = createStorySeed(
    source as MessageItem[] | undefined,
    14,
    '总览场景'
  ).map(item => {
    return { ...item } as TimelineItem;
  });

  nextKey = getLastMessageKey(base);
  base.splice(3, 0, createNode('history-divider', '以上为历史消息', 'info'));
  base.splice(
    8,
    0,
    createNode('date-divider', '2026 年 4 月 14 日 18:20', 'success')
  );
  base.push(
    createNode(
      'system-tip',
      '系统提示：当前正在综合验证 BubbleList 的聊天时间线能力。',
      'warning'
    )
  );

  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  historyBatchCount.value = 0;
  bottomBatchCount.value = 0;
  topStatus.value = null;
  bottomStatus.value = null;
  isStreaming.value = false;
  streamProgress.value = 0;
  activity.value =
    '这里专门验收复杂时间线：流式续写、特殊节点、双向加载和回底协同。';

  return base;
}

function resetConversation(source?: TimelineItem[]) {
  stopStreaming('已重置综合演示会话。');
  bubbleItems.value = buildSeedList(source);
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

function appendMessage(role: 'ai' | 'user') {
  nextKey += 1;
  bubbleItems.value.push(
    createStoryMessage(
      nextKey,
      role,
      role === 'user'
        ? '用户补充问题：请继续说明回底按钮、自定义节点和双向加载如何协同工作。'
        : 'AI 补充回复：这条消息用于观察综合场景下的自动触底、未读计数与默认/自定义回底按钮是否同时正常工作。'.repeat(
            role === 'ai' ? 2 : 1
          )
    ) as TimelineItem
  );
  activity.value = role === 'user' ? '已追加用户消息。' : '已追加 AI 消息。';
}

function appendDateDivider() {
  bubbleItems.value.push(
    createNode(
      'date-divider',
      `2026 年 4 月 14 日 18:${String(nextKey % 60).padStart(2, '0')}`,
      'success'
    )
  );
  activity.value = '已插入日期节点。';
}

function appendSystemTip() {
  bubbleItems.value.push(
    createNode(
      'system-tip',
      '系统提示：这条特殊节点不应计入未读消息，也不应干扰自动跟随。',
      'warning'
    )
  );
  activity.value = '已插入系统提示节点。';
}

function createLoadBatch(label: string, startRole: 'ai' | 'user') {
  const batch = createStorySequence({
    startKey: nextKey + 1,
    count: PAGE_SIZE,
    label,
    startRole
  });

  nextKey += batch.length;
  return batch as TimelineItem[];
}

function handleLoadMoreTop() {
  if (topTimer !== null || historyBatchCount.value >= MAX_HISTORY_BATCHES) {
    topStatus.value = { type: 'no-more', text: '顶部历史消息已全部加载完毕' };
    return;
  }

  topStatus.value = { type: 'loading', text: '正在加载更早的历史消息...' };
  activity.value = '已触发顶部历史加载。';

  topTimer = window.setTimeout(() => {
    const nextBatch = historyBatchCount.value + 1;
    const historyItems = createLoadBatch(
      `总览历史批次 ${nextBatch}`,
      nextBatch % 2 === 0 ? 'user' : 'ai'
    );
    bubbleItems.value = [...historyItems, ...bubbleItems.value];
    historyBatchCount.value = nextBatch;
    topTimer = null;
    topStatus.value =
      historyBatchCount.value >= MAX_HISTORY_BATCHES
        ? { type: 'no-more', text: '顶部历史消息已全部加载完毕' }
        : null;
    activity.value = `顶部加载完成：已插入历史批次 ${nextBatch}。`;
    nextTick(() => {
      bubbleListRef.value?.loadMoreTopComplete();
    });
  }, 550);
}

function handleLoadMoreBottom() {
  if (bottomTimer !== null || bottomBatchCount.value >= MAX_BOTTOM_BATCHES) {
    bottomStatus.value = {
      type: 'no-more',
      text: '底部更多消息已全部加载完毕'
    };
    return;
  }

  bottomStatus.value = { type: 'loading', text: '正在加载更多消息...' };
  activity.value = '已触发底部加载更多。';

  bottomTimer = window.setTimeout(() => {
    const nextBatch = bottomBatchCount.value + 1;
    const nextItems = createLoadBatch(
      `总览底部批次 ${nextBatch}`,
      nextBatch % 2 === 0 ? 'ai' : 'user'
    );
    bubbleItems.value = [...bubbleItems.value, ...nextItems];
    bottomBatchCount.value = nextBatch;
    bottomTimer = null;
    bottomStatus.value =
      bottomBatchCount.value >= MAX_BOTTOM_BATCHES
        ? { type: 'no-more', text: '底部更多消息已全部加载完毕' }
        : null;
    activity.value = `底部加载完成：已追加批次 ${nextBatch}。`;
    nextTick(() => {
      bubbleListRef.value?.loadMoreBottomComplete();
    });
  }, 550);
}

function buildStreamingCharacters() {
  const totalChars = STREAM_CHARS_PER_TICK * STREAM_TOTAL_TICKS;
  const paragraphs = Array.from({ length: STREAM_TOTAL_TICKS }, (_, index) => {
    const step = index + 1;
    return `第${step}次增量输出，用来验证综合演示页中最后一条 AI 消息在持续变高时仍能稳定贴底，且上滑后只累计未读。`;
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
  activity.value = reason;
}

function startStreaming() {
  if (isStreaming.value) {
    return;
  }

  appendMessage('user');
  streamCharacters = buildStreamingCharacters();
  streamOffset = 0;
  streamProgress.value = 0;

  const initialChunk = streamCharacters
    .slice(0, STREAM_CHARS_PER_TICK)
    .join('');
  streamOffset = initialChunk.length;
  streamProgress.value = streamOffset;

  nextKey += 1;
  bubbleItems.value.push(
    createStoryMessage(nextKey, 'ai', initialChunk, {
      loading: false
    }) as TimelineItem
  );

  isStreaming.value = true;
  activity.value =
    '流式输出进行中：请尝试上滑，再观察回底按钮与后续跟随是否稳定。';

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
      stopStreaming('流式输出完成。');
      return;
    }

    const nextChunk = streamCharacters
      .slice(streamOffset, streamOffset + STREAM_CHARS_PER_TICK)
      .join('');

    if (!nextChunk) {
      stopStreaming('流式输出完成。');
      return;
    }

    currentItem.content += nextChunk;
    streamOffset += nextChunk.length;
    streamProgress.value = streamOffset;

    if (streamOffset >= streamCharacters.length) {
      stopStreaming('流式输出完成。');
    }
  }, STREAM_TICK_MS);
}

function handleScrollStateChange(state: BubbleListScrollState) {
  scrollState.value = state;
}

function handleUnreadCountChange(count: number) {
  unreadCount.value = count;
}

function resolveToneClass(context: BubbleListItemContext<TimelineItem>) {
  if (context.itemType === 'date-divider') {
    return 'is-success';
  }

  return context.item.tone === 'warning' ? 'is-warning' : 'is-info';
}

watch(
  () => props.list,
  source => {
    resetConversation(source as TimelineItem[] | undefined);
  },
  { immediate: true }
);

onUnmounted(() => {
  stopStreaming('组件卸载，已清理综合演示的流式定时器。');
  if (topTimer !== null) {
    window.clearTimeout(topTimer);
  }
  if (bottomTimer !== null) {
    window.clearTimeout(bottomTimer);
  }
});
</script>

<template>
  <div class="demo-shell">
    <div class="demo-head">
      <div>
        <div class="demo-title">复杂时间线 / 流式、分页、特殊节点</div>
        <p class="demo-caption">
          这个 story
          只验收复杂聊天时间线。顶部信息压薄后，列表区固定吃剩余高度，优先保留
          BubbleList 内部滚动。
        </p>
      </div>
    </div>

    <div class="toolbar-group">
      <div class="btn-list">
        <el-button
          size="small"
          type="primary"
          plain
          @click="appendMessage('user')"
        >
          追加用户消息
        </el-button>
        <el-button
          size="small"
          type="primary"
          plain
          @click="appendMessage('ai')"
        >
          追加 AI 消息
        </el-button>
        <el-button
          size="small"
          type="success"
          plain
          :disabled="isStreaming"
          @click="startStreaming"
        >
          开始流式回复
        </el-button>
        <el-button
          size="small"
          type="danger"
          plain
          :disabled="!isStreaming"
          @click="stopStreaming('已手动停止综合演示中的流式回复。')"
        >
          停止流式回复
        </el-button>
      </div>

      <div class="btn-list">
        <el-button size="small" type="success" plain @click="appendDateDivider">
          插入日期节点
        </el-button>
        <el-button size="small" type="warning" plain @click="appendSystemTip">
          插入系统提示
        </el-button>
        <el-button
          size="small"
          type="info"
          plain
          @click="bubbleListRef?.scrollToTop(false)"
        >
          滚到顶部触发加载
        </el-button>
        <el-button
          size="small"
          type="info"
          plain
          @click="bubbleListRef?.scrollToBottom(false)"
        >
          滚到底部触发加载
        </el-button>
        <el-button
          size="small"
          type="info"
          plain
          @click="resetConversation(props.list as TimelineItem[] | undefined)"
        >
          重置总览场景
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
        <span>流式进度</span>
        <strong>{{ streamProgress }}</strong>
      </div>
      <div class="status-chip">
        <span>顶部批次</span>
        <strong>{{ historyBatchCount }}/{{ MAX_HISTORY_BATCHES }}</strong>
      </div>
      <div class="status-chip">
        <span>底部批次</span>
        <strong>{{ bottomBatchCount }}/{{ MAX_BOTTOM_BATCHES }}</strong>
      </div>
    </div>

    <div class="activity-bar">
      <span>最近动作</span>
      <strong>{{ activity }}</strong>
    </div>

    <div class="story-stage">
      <BubbleList
        v-bind="props"
        ref="bubbleListRef"
        :list="bubbleItems"
        :always-show-scrollbar="props.alwaysShowScrollbar ?? true"
        :top-status="topStatus"
        :bottom-status="bottomStatus"
        :item-key="props.itemKey ?? 'key'"
        @load-more-top="handleLoadMoreTop"
        @load-more-bottom="handleLoadMoreBottom"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <template #item="context">
          <div class="timeline-node" :class="[resolveToneClass(context)]">
            <template v-if="context.itemType === 'date-divider'">
              <span class="timeline-node__pill">{{
                context.item.content
              }}</span>
            </template>

            <template v-else-if="context.itemType === 'history-divider'">
              <span class="timeline-node__line" />
              <span class="timeline-node__text">{{
                context.item.content
              }}</span>
              <span class="timeline-node__line" />
            </template>

            <template v-else>
              <span class="timeline-node__icon">i</span>
              <span class="timeline-node__text">{{
                context.item.content
              }}</span>
            </template>
          </div>
        </template>

        <template #topStatus="{ status }">
          <div class="edge-status" :data-state="status.type">
            <span class="edge-status__dot" />
            <span>{{ status.text }}</span>
          </div>
        </template>

        <template #bottomStatus="{ status }">
          <div class="edge-status" :data-state="status.type">
            <span class="edge-status__dot" />
            <span>{{ status.text }}</span>
          </div>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.demo-shell {
  display: grid;
  grid-template-rows: auto auto auto auto auto;
  gap: 10px;
  padding: 10px;
  box-sizing: border-box;
}

.demo-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
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
  display: grid;
  gap: 6px;
}

.btn-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
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

  span,
  strong {
    line-height: 1;
  }

  span {
    color: #64748b;
    font-size: 12px;
  }

  strong {
    color: #0f172a;
    font-size: 14px;
  }
}

.activity-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  min-height: 34px;
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
  min-height: 520px;
  height: 520px;
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

.timeline-node {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 40px;
  color: #475569;
}

.timeline-node__line {
  flex: 1;
  max-width: 120px;
  height: 1px;
  background: currentColor;
  opacity: 0.25;
}

.timeline-node__pill,
.timeline-node__text {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.24);
  text-align: center;
}

.timeline-node__icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  background: currentColor;
  color: #fff;
}

.edge-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(148, 163, 184, 0.24);
  font-size: 13px;
  color: #475569;

  &[data-state='loading'] {
    color: #1d4ed8;
  }

  &[data-state='no-more'] {
    color: #64748b;
  }
}

.edge-status__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.8;
}

.is-info {
  color: #475569;
}

.is-success {
  color: #0f766e;
}

.is-warning {
  color: #b45309;
}
</style>
