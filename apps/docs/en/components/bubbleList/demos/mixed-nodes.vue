<docs>
---
title: Mixed Nodes (#item Slot)
---

In addition to bubble messages, the list can contain arbitrary node types (date dividers, system tips, history-load markers, etc.). Mark non-bubble nodes via the `itemType` property or a resolver function — matched items render through the `#item` slot while normal messages still use the default Bubble.

The slot context `{ item, index, itemType }` distinguishes node types for different UI rendering. Special node heights are automatically measured in virtual scroll.
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
          ? `Initial AI message ${i + 1}: used to verify scroll stability with mixed nodes.`
          : `Initial user message ${i + 1}`
      )
    );
  }

  nextKey = base.length;
  base.splice(
    2,
    0,
    createNode('history-divider', 'Above are history messages', 'info')
  );
  base.splice(
    6,
    0,
    createNode('date-divider', 'April 16, 2026 14:30', 'success')
  );
  base.push(
    createNode(
      'system-tip',
      'System notice: The conversation has switched to a new response strategy.',
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
      'AI continues replying: verifying that auto-scroll and unread count remain accurate with special nodes mixed between regular messages.'
    )
  );
}

function appendDateDivider() {
  bubbleItems.value.push(
    createNode(
      'date-divider',
      `April 16, 2026 ${String(15 + (nextKey % 9))}:${String(nextKey % 60).padStart(2, '0')}`,
      'success'
    )
  );
}

function appendHistoryDivider() {
  bubbleItems.value.push(
    createNode(
      'history-divider',
      'Switched to another segment of history',
      'info'
    )
  );
}

function appendSystemTip() {
  bubbleItems.value.push(
    createNode(
      'system-tip',
      'System notice: The model is organizing a longer context. Please wait.',
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
      <div class="demo-title">Mixed Nodes / Unified Item Slot</div>
      <p>
        Regular messages continue using the default Bubble renderer; when an
        item contains a special identifier, it goes through the unified
        <code>#item</code> slot. This demo shows date nodes, history-divider
        nodes, and system-tip nodes coexisting on the same timeline.
      </p>
    </div>

    <div class="toolbar-group">
      <div class="btn-list">
        <el-button type="primary" plain @click="appendAiMessage">
          Append AI Message
        </el-button>
        <el-button type="success" plain @click="appendDateDivider">
          Insert Date Node
        </el-button>
        <el-button type="info" plain @click="appendHistoryDivider">
          Insert History Divider
        </el-button>
        <el-button type="warning" plain @click="appendSystemTip">
          Insert System Tip
        </el-button>
        <el-button type="info" plain @click="resetConversation">
          Reset Timeline
        </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-card">
        <span>Scroll State</span
        ><strong :class="`state-${scrollState.toLowerCase()}`">{{
          scrollState
        }}</strong>
      </div>
      <div class="status-card">
        <span>Unread Count</span><strong>{{ unreadCount }}</strong>
      </div>
      <div class="status-card">
        <span>Node Count</span><strong>{{ bubbleItems.length }}</strong>
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
