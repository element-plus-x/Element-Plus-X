<docs>
---
title: 混合节点（#item 插槽）
---

列表中除气泡消息外，可以混入任意类型的节点（日期分隔线、系统提示、历史加载标记等）。通过 `itemType` 属性或解析函数标记非气泡节点，命中后走 `#item` 插槽渲染，普通消息仍走默认 Bubble。

插槽上下文 `{ item, index, itemType }` 用于区分节点类型，渲染不同 UI。虚拟滚动中特殊节点的高度同样会自动测量。
</docs>

<script setup lang="ts">
import type {
  BubbleListInstance,
  BubbleListItemContext,
  BubbleListScrollState
} from 'vue-element-plus-x/types/BubbleList';

interface TimelineItem {
  key: number;
  role: 'user' | 'ai' | 'system';
  placement: 'start' | 'end';
  content: string;
  avatar: string;
  avatarSize?: string;
  itemType?: 'date-divider' | 'history-divider' | 'system-tip';
  tone?: 'info' | 'success' | 'warning';
  noStyle?: boolean;
}

const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<TimelineItem[]>([]);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
let nextKey = 0;

function createMessage(
  key: number,
  role: 'user' | 'ai',
  content: string
): TimelineItem {
  const isUser = role === 'user';
  return {
    key,
    role,
    placement: isUser ? 'end' : 'start',
    content,
    avatar: isUser
      ? 'https://avatars.githubusercontent.com/u/76239030?v=4'
      : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    avatarSize: '32px',
    noStyle: false
  };
}

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

function buildInitialList(): TimelineItem[] {
  const base: TimelineItem[] = [];
  for (let i = 0; i < 6; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    base.push(
      createMessage(
        i + 1,
        role,
        role === 'ai'
          ? `初始 AI 消息 ${i + 1}：用于验证混合节点的滚动稳定性。`
          : `初始用户消息 ${i + 1}`
      )
    );
  }

  nextKey = base.length;
  base.splice(2, 0, createNode('history-divider', '以上为历史消息', 'info'));
  base.splice(
    6,
    0,
    createNode('date-divider', '2026 年 4 月 16 日 14:30', 'success')
  );
  base.push(
    createNode(
      'system-tip',
      '系统提示：当前会话已切换到新的回答策略。',
      'warning'
    )
  );

  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  return base;
}

function resetConversation() {
  bubbleItems.value = buildInitialList();
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

function appendAiMessage() {
  bubbleItems.value.push(
    createMessage(
      ++nextKey,
      'ai',
      'AI 继续回复：验证特殊节点夹在普通消息之间时，自动滚底和未读计数是否准确。'
    )
  );
}

function appendDateDivider() {
  bubbleItems.value.push(
    createNode(
      'date-divider',
      `2026 年 4 月 16日 ${String(15 + (nextKey % 9))}:${String(nextKey % 60).padStart(2, '0')}`,
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
  if (context.itemType === 'date-divider') return 'is-success';
  return context.item.tone === 'warning' ? 'is-warning' : 'is-info';
}

onMounted(() => {
  resetConversation();
});
</script>

<template>
  <div class="mixed-nodes-demo">
    <div class="demo-note">
      <div class="demo-title">混合节点 / 统一 item 插槽</div>
      <p>
        普通消息继续使用默认 Bubble 渲染；当 item 中包含特殊标识符时，统一走
        <code>#item</code> 插槽。
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
        <el-button type="info" plain @click="resetConversation">
          重置时间线
        </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-card">
        <span>滚动状态</span
        ><strong :class="`state-${scrollState.toLowerCase()}`">{{
          scrollState
        }}</strong>
      </div>
      <div class="status-card">
        <span>未读计数</span><strong>{{ unreadCount }}</strong>
      </div>
      <div class="status-card">
        <span>节点总数</span><strong>{{ bubbleItems.length }}</strong>
      </div>
    </div>

    <div class="story-stage">
      <BubbleList
        ref="bubbleListRef"
        :list="bubbleItems"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <template #item="context">
          <div class="timeline-node" :class="[resolveToneClass(context)]">
            <div
              v-if="context.itemType === 'history-divider'"
              class="timeline-node__history-wrap"
            >
              <span class="timeline-node__line" /><span
                class="timeline-node__text"
                >{{ context.item.content }}</span
              ><span class="timeline-node__line" />
            </div>
            <span
              v-else-if="context.itemType === 'date-divider'"
              class="timeline-node__pill"
              >{{ context.item.content }}</span
            >
            <div v-else class="timeline-node__system-wrap">
              <span class="timeline-node__icon">i</span
              ><span class="timeline-node__text">{{
                context.item.content
              }}</span>
            </div>
          </div>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.mixed-nodes-demo {
  display: flex;
  flex-direction: column;
  gap: 14px;

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
    code {
      padding: 1px 5px;
      border-radius: 3px;
      background: rgba(0, 0, 0, 0.06);
      font-family: ui-monospace, monospace;
      font-size: 12px;
    }
  }

  .demo-title {
    font-weight: 700;
    color: #1e3a8a;
    font-size: 15px;
  }
  .toolbar-group {
    display: grid;
    gap: 10px;
  }
  .btn-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .status-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }

  .status-card {
    display: grid;
    gap: 4px;
    padding: 10px 14px;
    border-radius: 12px;
    background: #fff;
    border: 1px solid #e5e7eb;
    span {
      font-size: 12px;
      color: #64748b;
    }
    strong {
      font-size: 14px;
      color: #0f172a;
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

  .story-stage {
    height: 450px;
    padding: 8px 10px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }
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
.timeline-node__history-wrap,
.timeline-node__system-wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
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
