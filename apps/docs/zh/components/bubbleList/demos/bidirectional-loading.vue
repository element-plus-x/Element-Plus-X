<docs>
---
title: 双向分页加载
---

向上滚到顶部触发 `@load-more-top`，向下滚到底部触发 `@load-more-bottom`。数据准备完毕后调用 `loadMoreTopComplete()` / `loadMoreBottomComplete()` 通知组件，滚动位置自动修复，无需手动处理跳动。

通过 `topStatus` / `bottomStatus` 属性（`{ type, text }`）控制边界状态区的展示（`loading` / `no-more`），配合 `#topStatus` / `#bottomStatus` 插槽自定义 UI。
</docs>

<script setup lang="ts">
import type {
  BubbleListBoundaryState,
  BubbleListInstance,
  BubbleListScrollState
} from 'vue-element-plus-x/types/BubbleList';
import { computed } from 'vue';

interface MessageItem {
  key: number;
  role: 'user' | 'ai';
  placement: 'start' | 'end';
  content: string;
  avatar: string;
  avatarSize?: string;
  avatarGap?: string;
  shape?: string;
  variant?: string;
}

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

function createMessage(
  key: number,
  role: 'user' | 'ai',
  content: string
): MessageItem {
  const isUser = role === 'user';
  return {
    key,
    role,
    placement: isUser ? 'end' : 'start',
    content,
    avatar: isUser
      ? 'https://avatars.githubusercontent.com/u/76239030?v=4'
      : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    avatarSize: '24px',
    avatarGap: '12px',
    shape: 'corner',
    variant: isUser ? 'outlined' : 'filled'
  };
}

function createBatch(label: string, startRole: 'ai' | 'user'): MessageItem[] {
  const batch: MessageItem[] = [];
  for (let i = 0; i < PAGE_SIZE; i++) {
    const role =
      startRole === 'ai'
        ? i % 2 === 0
          ? 'ai'
          : 'user'
        : i % 2 === 0
          ? 'user'
          : 'ai';
    const step = i + 1;
    batch.push(
      createMessage(
        nextKey + i + 1,
        role,
        role === 'user'
          ? `${label} 用户消息 ${step}：用于验证滚动位置、回底按钮和分页触发。`
          : `${label} AI 回复 ${step}：这条消息会刻意保持不同长度，用来验证变高气泡与自动跟随是否稳定。`.repeat(
              step % 3 === 0 ? 2 : 1
            )
      )
    );
  }
  return batch;
}

function buildSeedList(): MessageItem[] {
  const list: MessageItem[] = [];
  for (let i = 0; i < 16; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    list.push(
      createMessage(
        i + 1,
        role,
        role === 'ai' ? `初始 AI 消息 ${i + 1}` : `初始用户消息 ${i + 1}`
      )
    );
  }
  nextKey = list.length;
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

function resetConversation() {
  bubbleItems.value = buildSeedList();
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

// ---- 边界状态计算 ----
const topStatus = computed<BubbleListBoundaryState | null>(() => {
  if (topLoading.value)
    return { type: 'loading', text: '正在加载更早的历史消息...' };
  if (historyBatchCount.value >= MAX_HISTORY_BATCHES)
    return { type: 'no-more', text: '历史消息已经全部加载完毕' };
  return null;
});

const bottomStatus = computed<BubbleListBoundaryState | null>(() => {
  if (bottomLoading.value)
    return { type: 'loading', text: '正在加载更多消息...' };
  if (bottomBatchCount.value >= MAX_BOTTOM_BATCHES)
    return { type: 'no-more', text: '已经展示全部可加载消息' };
  return null;
});

// ---- 分页事件处理 ----
function handleLoadMoreTop() {
  topTriggerCount.value += 1;
  if (topLoading.value) return;

  topLoading.value = true;
  const n = historyBatchCount.value + 1;

  topTimer = window.setTimeout(() => {
    if (historyBatchCount.value >= MAX_HISTORY_BATCHES) {
      lastAction.value = '顶部历史消息已全部加载完毕。';
      topLoading.value = false;
      topTimer = null;
      bubbleListRef.value?.loadMoreTopComplete();
      return;
    }

    const items = createBatch(`历史批次 ${n}`, n % 2 === 0 ? 'user' : 'ai');
    nextKey += items.length;
    bubbleItems.value = [...items, ...bubbleItems.value];
    historyBatchCount.value = n;
    topLoading.value = false;
    lastAction.value = `顶部加载完成：已插入历史批次 ${n}。`;
    topTimer = null;
    nextTick(() => {
      bubbleListRef.value?.loadMoreTopComplete();
    });
  }, 600);
}

function handleLoadMoreBottom() {
  bottomTriggerCount.value += 1;
  if (bottomLoading.value) return;

  bottomLoading.value = true;
  const n = bottomBatchCount.value + 1;

  bottomTimer = window.setTimeout(() => {
    if (bottomBatchCount.value >= MAX_BOTTOM_BATCHES) {
      lastAction.value = '底部更多消息已全部加载完毕。';
      bottomLoading.value = false;
      bottomTimer = null;
      bubbleListRef.value?.loadMoreBottomComplete();
      return;
    }

    const items = createBatch(`底部批次 ${n}`, n % 2 === 0 ? 'ai' : 'user');
    nextKey += items.length;
    bubbleItems.value = [...bubbleItems.value, ...items];
    bottomBatchCount.value = n;
    bottomLoading.value = false;
    lastAction.value = `底部加载完成：已追加批次 ${n}。`;
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

onMounted(() => {
  resetConversation();
});
onUnmounted(() => {
  if (topTimer) window.clearTimeout(topTimer);
  if (bottomTimer) window.clearTimeout(bottomTimer);
});
</script>

<template>
  <div class="bidirectional-demo">
    <div class="tip-banner">
      <span class="tip-icon">↕</span>
      <span
        >先<strong>向上滚动</strong>到顶部触发历史加载，再<strong>向下滚动</strong>到底部触发更多消息。观察边界状态区的
        loading → no-more 切换。</span
      >
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
        <el-button size="small" type="info" plain @click="resetConversation">
          重置数据
        </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-chip">
        <span>滚动状态</span
        ><strong :class="`state-${scrollState.toLowerCase()}`">{{
          scrollState
        }}</strong>
      </div>
      <div class="status-chip">
        <span>未读计数</span><strong>{{ unreadCount }}</strong>
      </div>
      <div class="status-chip">
        <span>顶部触发次数</span><strong>{{ topTriggerCount }}</strong>
      </div>
      <div class="status-chip">
        <span>底部触发次数</span><strong>{{ bottomTriggerCount }}</strong>
      </div>
      <div class="status-chip">
        <span>历史批次</span
        ><strong>{{ historyBatchCount }}/{{ MAX_HISTORY_BATCHES }}</strong>
      </div>
      <div class="status-chip">
        <span>底部批次</span
        ><strong>{{ bottomBatchCount }}/{{ MAX_BOTTOM_BATCHES }}</strong>
      </div>
    </div>

    <div class="activity-bar">
      <span>最近动作</span><strong>{{ lastAction }}</strong>
      <small>
        顶部加载中：{{ topLoading ? '是' : '否' }}，底部加载中：{{
          bottomLoading ? '是' : '否'
        }}</small
      >
    </div>

    <div class="story-stage">
      <BubbleList
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
            <span class="edge-status__dot" /><span>{{ status.text }}</span>
          </div>
        </template>

        <template #bottomStatus="{ status }">
          <div class="edge-status" :data-state="status.type">
            <span class="edge-status__dot" /><span>{{ status.text }}</span>
          </div>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.bidirectional-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;

  .tip-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f0f9eb 0%, #ecf5ff 100%);
    border: 1px solid #e1f3d8;
    font-size: 13px;
    color: #67c23a;
    .tip-icon {
      font-size: 18px;
      font-weight: 700;
    }
    strong {
      color: #303133;
    }
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
    gap: 6px;
    min-height: 32px;
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
      font-size: 13px;
      color: #0f172a;
      line-height: 1;
      &.state-at_bottom {
        color: #67c23a;
      }
      &.state-scrolled_up {
        color: #e6a23c;
      }
      &.state-has_new_messages {
        color: #f56c6c;
      }
    }
  }

  .activity-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-height: 32px;
    padding: 0 12px;
    border-radius: 999px;
    background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
    border: 1px solid #dbeafe;
    span {
      font-size: 12px;
      color: #64748b;
    }
    strong {
      font-size: 13px;
      color: #1e3a8a;
    }
    small {
      color: #64748b;
      font-size: 12px;
      margin-left: 4px;
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
