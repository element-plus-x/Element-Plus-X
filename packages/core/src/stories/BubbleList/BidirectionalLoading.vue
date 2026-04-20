<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type {
  BubbleListInstance,
  BubbleListProps,
  BubbleListScrollState
} from '@components/BubbleList/types';
import BubbleList from '@components/BubbleList/index.vue';
import {
  createStorySeed,
  createStorySequence,
  getLastMessageKey
} from './story-utils';

const props = withDefaults(
  defineProps<Partial<BubbleListProps<MessageItem>>>(),
  {
    list: () => []
  }
);

const MAX_HISTORY_BATCHES = 3;
const MAX_BOTTOM_BATCHES = 2;
const PAGE_SIZE = 6;

const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<MessageItem[]>([]);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const historyBatchCount = ref(0);
const bottomBatchCount = ref(0);
const topTriggerCount = ref(0);
const bottomTriggerCount = ref(0);
const topLoading = ref(false);
const bottomLoading = ref(false);
const lastAction = ref(
  '手动滚动到顶部触发历史加载，回到底部继续向下滚动可触发更多消息。'
);
let nextKey = 0;
let topTimer: number | null = null;
let bottomTimer: number | null = null;

const topStatus = computed(() => {
  if (topLoading.value) {
    return {
      type: 'loading',
      text: '正在加载更早的历史消息...'
    } as const;
  }

  if (historyBatchCount.value >= MAX_HISTORY_BATCHES) {
    return {
      type: 'no-more',
      text: '历史消息已经全部加载完毕'
    } as const;
  }

  return null;
});

const bottomStatus = computed(() => {
  if (bottomLoading.value) {
    return {
      type: 'loading',
      text: '正在加载更多消息...'
    } as const;
  }

  if (bottomBatchCount.value >= MAX_BOTTOM_BATCHES) {
    return {
      type: 'no-more',
      text: '已经展示全部可加载消息'
    } as const;
  }

  return null;
});

function buildSeedList(source?: MessageItem[]) {
  const list = createStorySeed(
    source && source.length > 0 ? source : undefined,
    16,
    '分页自测'
  );

  nextKey = getLastMessageKey(list);
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  historyBatchCount.value = 0;
  bottomBatchCount.value = 0;
  topTriggerCount.value = 0;
  bottomTriggerCount.value = 0;
  topLoading.value = false;
  bottomLoading.value = false;
  lastAction.value =
    '手动滚动到顶部触发历史加载，回到底部继续向下滚动可触发更多消息。';

  return list;
}

function resetConversation(source?: MessageItem[]) {
  bubbleItems.value = buildSeedList(source);
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

function handleReset() {
  resetConversation(props.list as MessageItem[] | undefined);
}

function createBatch(label: string, startRole: 'ai' | 'user') {
  const batch = createStorySequence({
    startKey: nextKey + 1,
    count: PAGE_SIZE,
    label,
    startRole
  });

  nextKey += batch.length;
  return batch;
}

function handleLoadMoreTop() {
  topTriggerCount.value += 1;

  if (topLoading.value) {
    return;
  }

  topLoading.value = true;
  const nextBatch = historyBatchCount.value + 1;

  topTimer = window.setTimeout(() => {
    if (historyBatchCount.value >= MAX_HISTORY_BATCHES) {
      lastAction.value = '顶部历史消息已全部加载完毕。';
      topLoading.value = false;
      topTimer = null;
      bubbleListRef.value?.loadMoreTopComplete();
      return;
    }

    const historyItems = createBatch(
      `历史批次 ${nextBatch}`,
      nextBatch % 2 === 0 ? 'user' : 'ai'
    );
    bubbleItems.value = [...historyItems, ...bubbleItems.value];
    historyBatchCount.value = nextBatch;
    topLoading.value = false;
    lastAction.value = `顶部加载完成：已插入历史批次 ${nextBatch}。`;
    topTimer = null;
    nextTick(() => {
      bubbleListRef.value?.loadMoreTopComplete();
    });
  }, 600);
}

function handleLoadMoreBottom() {
  bottomTriggerCount.value += 1;

  if (bottomLoading.value) {
    return;
  }

  bottomLoading.value = true;
  const nextBatch = bottomBatchCount.value + 1;

  bottomTimer = window.setTimeout(() => {
    if (bottomBatchCount.value >= MAX_BOTTOM_BATCHES) {
      lastAction.value = '底部更多消息已全部加载完毕。';
      bottomLoading.value = false;
      bottomTimer = null;
      bubbleListRef.value?.loadMoreBottomComplete();
      return;
    }

    const newerItems = createBatch(
      `底部批次 ${nextBatch}`,
      nextBatch % 2 === 0 ? 'ai' : 'user'
    );
    bubbleItems.value = [...bubbleItems.value, ...newerItems];
    bottomBatchCount.value = nextBatch;
    bottomLoading.value = false;
    lastAction.value = `底部加载完成：已追加批次 ${nextBatch}。`;
    bottomTimer = null;
    nextTick(() => {
      bubbleListRef.value?.loadMoreBottomComplete();
    });
  }, 600);
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
      <div class="demo-title">双向加载 / 状态区域 / 历史消息</div>
      <p class="demo-caption">
        这里只验收 prepend、append 和边界状态区，壳层固定高度后只保留 BubbleList
        内部滚动。
      </p>
    </div>

    <div class="toolbar-group">
      <div class="btn-list">
        <el-button
          size="small"
          type="primary"
          plain
          @click="bubbleListRef?.scrollToTop()"
        >
          滚到顶部
        </el-button>
        <el-button
          size="small"
          type="primary"
          plain
          @click="bubbleListRef?.scrollToBottom()"
        >
          滚到底部
        </el-button>
        <el-button size="small" type="info" plain @click="handleReset">
          重置数据
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
        <span>顶部触发次数</span>
        <strong>{{ topTriggerCount }}</strong>
      </div>
      <div class="status-chip">
        <span>底部触发次数</span>
        <strong>{{ bottomTriggerCount }}</strong>
      </div>
      <div class="status-chip">
        <span>已加载历史批次</span>
        <strong>{{ historyBatchCount }}/{{ MAX_HISTORY_BATCHES }}</strong>
      </div>
      <div class="status-chip">
        <span>已加载底部批次</span>
        <strong>{{ bottomBatchCount }}/{{ MAX_BOTTOM_BATCHES }}</strong>
      </div>
    </div>

    <div class="activity-bar">
      <span>最近动作</span>
      <strong>{{ lastAction }}</strong>
      <small>
        顶部加载中：{{ topLoading ? '是' : '否' }}，底部加载中：{{
          bottomLoading ? '是' : '否'
        }}
      </small>
    </div>

    <div class="story-stage">
      <BubbleList
        v-bind="props"
        ref="bubbleListRef"
        :list="bubbleItems"
        :top-status="topStatus"
        :bottom-status="bottomStatus"
        @load-more-top="handleLoadMoreTop"
        @load-more-bottom="handleLoadMoreBottom"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
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

  small {
    color: #64748b;
    font-size: 12px;
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
</style>
