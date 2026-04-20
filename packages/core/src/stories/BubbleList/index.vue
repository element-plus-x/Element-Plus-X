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

const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<MessageItem[]>([]);
const targetIndex = ref(0);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const userMessageCount = ref(1);
const aiMessageCount = ref(1);
let nextKey = 0;

function buildInitialList(source?: MessageItem[]) {
  const list = createStorySeed(
    source && source.length > 0 ? source : undefined,
    10,
    '基础自测'
  );

  nextKey = getLastMessageKey(list);
  userMessageCount.value = 1;
  aiMessageCount.value = 1;
  targetIndex.value = Math.max(list.length - 1, 0);
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;

  return list;
}

function resetConversation(source?: MessageItem[]) {
  bubbleItems.value = buildInitialList(source);
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

function handleReset() {
  resetConversation(props.list as MessageItem[] | undefined);
}

function appendConversationRound() {
  appendMessage('user');
  appendMessage('ai');
}

function appendMessage(role: 'ai' | 'user') {
  const count =
    role === 'user' ? userMessageCount.value++ : aiMessageCount.value++;
  const content =
    role === 'user'
      ? `用户补充问题 ${count}：请继续展开第 ${count} 个交互场景。`
      : `AI 最新回复 ${count}：验证 autoScroll 开启时，用户消息与 AI 消息均自动滚动到底部。关闭 autoScroll 后，新消息不再触发自动滚动，改为累计未读计数并显示回底按钮。`.repeat(
          count % 2 === 0 ? 2 : 1
        );

  nextKey += 1;
  bubbleItems.value.push(createStoryMessage(nextKey, role, content));
  targetIndex.value = bubbleItems.value.length - 1;
}

function appendBurstMessages() {
  const nextMessages = [
    createStoryMessage(
      nextKey + 1,
      'user',
      '用户连续补充：先插入一条短消息，观察列表锚点是否稳定。'
    ),
    createStoryMessage(
      nextKey + 2,
      'ai',
      'AI 连续返回：第二条刻意拉长内容，用来验证多条消息一起追加时的滚动状态与动态高度表现。'.repeat(
        2
      )
    ),
    createStoryMessage(
      nextKey + 3,
      'ai',
      'AI 连续返回：第三条消息保持较短，便于手动观察滚动位置是否仍然贴底。'
    )
  ];

  nextKey += nextMessages.length;
  bubbleItems.value.push(...nextMessages);
  targetIndex.value = bubbleItems.value.length - 1;
}

function scrollToTop() {
  bubbleListRef.value?.scrollToTop();
}

function scrollToBottom() {
  bubbleListRef.value?.scrollToBottom();
}

function scrollToBubble() {
  const index = Math.min(
    targetIndex.value,
    Math.max(bubbleItems.value.length - 1, 0)
  );
  bubbleListRef.value?.scrollToBubble(index);
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
</script>

<template>
  <div class="demo-shell">
    <div class="demo-head">
      <div>
        <div class="demo-title">基础消息流 / 滚动方法</div>
        <p class="demo-caption">
          这个 story 只看最基础的列表行为：追加消息、观察未读状态、验证
          scrollToTop / scrollToBottom / scrollToBubble。
        </p>
      </div>
    </div>

    <div class="toolbar-group">
      <div class="btn-list">
        <el-button type="primary" plain @click="appendConversationRound">
          添加对话
        </el-button>
        <el-button type="primary" plain @click="appendMessage('user')">
          追加用户消息
        </el-button>
        <el-button type="primary" plain @click="appendMessage('ai')">
          追加 AI 消息
        </el-button>
        <el-button type="primary" plain @click="appendBurstMessages">
          连续追加 3 条
        </el-button>
      </div>

      <div class="btn-list">
        <el-button type="primary" plain @click="scrollToTop">
          滚动到顶部
        </el-button>
        <el-button type="primary" plain @click="scrollToBottom">
          滚动到底部
        </el-button>
        <el-input-number
          v-model="targetIndex"
          :min="0"
          :max="Math.max(bubbleItems.length - 1, 0)"
          controls-position="right"
        />
        <el-button type="primary" plain @click="scrollToBubble">
          滚动到指定气泡
        </el-button>
        <el-button type="info" plain @click="handleReset"> 重置会话 </el-button>
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
        <span>消息总数</span>
        <strong>{{ bubbleItems.length }}</strong>
      </div>
      <div class="status-chip">
        <span>目标索引</span>
        <strong>{{ targetIndex }}</strong>
      </div>
    </div>

    <div class="story-stage">
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
  grid-template-rows: auto auto auto minmax(0, 1fr);
  gap: 12px;
  height: min(720px, calc(100vh - 24px));
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.demo-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  min-height: 0;
}

.demo-caption {
  margin: 6px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
}

.demo-title {
  font-weight: 700;
  color: #1e3a8a;
  font-size: 16px;
}

.toolbar-group {
  display: grid;
  gap: 8px;
}

.btn-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
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
  min-height: 36px;
  padding: 0 12px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #dbeafe;

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
  min-height: 0;
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
}
</style>
