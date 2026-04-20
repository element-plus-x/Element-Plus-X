<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type {
  BubbleListInstance,
  BubbleListItemContext,
  BubbleListProps,
  BubbleListScrollState
} from '@components/BubbleList/types';
import BubbleList from '@components/BubbleList/index.vue';
import {
  createStoryMessage,
  createStorySeed,
  getLastMessageKey
} from './story-utils';

type TimelineItem = MessageItem & {
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
let nextKey = 0;

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

function buildInitialList(source?: TimelineItem[]) {
  const seed = createStorySeed(
    source as MessageItem[] | undefined,
    6,
    '统一插槽'
  ).map(item => {
    return { ...item } as TimelineItem;
  });

  nextKey = getLastMessageKey(seed);

  seed.splice(2, 0, createNode('history-divider', '以上为历史消息', 'info'));
  seed.splice(
    6,
    0,
    createNode('date-divider', '2026 年 4 月 14 日 14:30', 'success')
  );
  seed.push(
    createNode(
      'system-tip',
      '系统提示：当前会话已切换到新的回答策略。',
      'warning'
    )
  );

  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  return seed;
}

function resetConversation(source?: TimelineItem[]) {
  bubbleItems.value = buildInitialList(source);
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

function appendAiMessage() {
  bubbleItems.value.push(
    createStoryMessage(
      ++nextKey,
      'ai',
      'AI 继续回复：这条消息用于验证特殊节点夹在普通消息之间时，自动滚底和未读计数仍然准确。'
    ) as TimelineItem
  );
}

function appendDateDivider() {
  bubbleItems.value.push(
    createNode(
      'date-divider',
      `2026 年 4 月 14 日 15:${String(nextKey % 60).padStart(2, '0')}`,
      'success'
    )
  );
}

function appendHistoryDivider() {
  bubbleItems.value.push(
    createNode('history-divider', '已切换到另一段历史消息', 'info')
  );
}

function appendSystemTip() {
  bubbleItems.value.push(
    createNode(
      'system-tip',
      '系统提示：模型正在整理更长的上下文，请稍候。',
      'warning'
    )
  );
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
</script>

<template>
  <div class="demo-shell">
    <div class="demo-note">
      <div class="demo-title">混合节点 / 统一 item 插槽</div>
      <p>
        普通消息继续使用默认 Bubble 渲染；当 item 中包含特殊标识符时，统一走
        #item 插槽。
        这里演示日期节点、历史分隔节点和系统提示节点共存于同一条时间线里。
      </p>
    </div>

    <div class="toolbar-group">
      <div class="btn-list">
        <el-button type="primary" plain @click="appendAiMessage">
          追加 AI 消息
        </el-button>
        <el-button type="success" plain @click="appendDateDivider">
          插入日期节点
        </el-button>
        <el-button type="info" plain @click="appendHistoryDivider">
          插入历史分隔
        </el-button>
        <el-button type="warning" plain @click="appendSystemTip">
          插入系统提示
        </el-button>
        <el-button
          type="info"
          plain
          @click="resetConversation(props.list as TimelineItem[] | undefined)"
        >
          重置时间线
        </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-card">
        <span>滚动状态</span>
        <strong>{{ scrollState }}</strong>
      </div>
      <div class="status-card">
        <span>未读计数</span>
        <strong>{{ unreadCount }}</strong>
      </div>
      <div class="status-card">
        <span>节点总数</span>
        <strong>{{ bubbleItems.length }}</strong>
      </div>
    </div>

    <div class="story-stage">
      <BubbleList
        v-bind="props"
        ref="bubbleListRef"
        :list="bubbleItems"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <template #item="context">
          <div class="timeline-node" :class="[resolveToneClass(context)]">
            <template v-if="context.itemType === 'history-divider'">
              <span class="timeline-node__line" />
              <span class="timeline-node__text">{{
                context.item.content
              }}</span>
              <span class="timeline-node__line" />
            </template>

            <template v-else-if="context.itemType === 'date-divider'">
              <span class="timeline-node__pill">{{
                context.item.content
              }}</span>
            </template>

            <template v-else>
              <span class="timeline-node__icon">i</span>
              <span class="timeline-node__text">{{
                context.item.content
              }}</span>
            </template>
          </div>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.demo-shell {
  display: grid;
  gap: 16px;
  padding: 12px;
}

.demo-note {
  padding: 14px 16px;
  border-radius: 14px;
  background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
  border: 1px solid #dbeafe;

  p {
    margin: 8px 0 0;
    color: #475569;
    line-height: 1.6;
  }
}

.demo-title {
  font-weight: 700;
  color: #1e3a8a;
}

.toolbar-group {
  display: grid;
  gap: 12px;
}

.btn-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.status-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.status-card {
  display: grid;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;

  span {
    font-size: 12px;
    color: #64748b;
  }

  strong {
    font-size: 15px;
    color: #0f172a;
  }
}

.story-stage {
  height: 520px;
  padding: 12px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
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
  background: rgba(255, 255, 255, 0.9);
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
