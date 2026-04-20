<docs>
---
title: Scroll Control Methods
---

Precisely control scroll position via three component instance methods: `scrollToTop()`, `scrollToBottom()`, `scrollToBubble(index)` — all support a `smooth` parameter for smooth scrolling.

Also exposes `currentScrollState` and `currentUnreadCount` instance properties. You can also listen to `@scroll-state-change` / `@unread-count-change` events for real-time state awareness (`AT_BOTTOM` / `SCROLLED_UP` / `HAS_NEW_MESSAGES`).
</docs>

<script setup lang="ts">
import type {
  BubbleListInstance,
  BubbleListScrollState
} from 'vue-element-plus-x/types/BubbleList';

interface listType {
  key: number;
  role: 'user' | 'ai';
  placement: 'start' | 'end';
  content: string;
  loading: boolean;
  shape: string;
  variant: string;
  avatar: string;
  avatarSize: string;
}

const bubbleItems = ref<listType[]>([]);
const bubbleListRef = ref<BubbleListInstance | null>(null);
const targetIndex = ref(0);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const autoScrollEnabled = ref(true);
let nextKey = 0;

function generateFakeItems(count: number): listType[] {
  const messages: listType[] = [];
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    const placement = role === 'ai' ? 'start' : 'end';
    const key = i + 1;
    const content =
      role === 'ai'
        ? '💖 Thank you for using Element Plus X ! Your support is our strongest motivation for open source ~'
        : `Hahaha, let me try`;
    messages.push({
      key,
      role,
      placement,
      content,
      loading: false,
      shape: 'corner',
      variant: role === 'ai' ? 'filled' : 'outlined',
      avatar:
        role === 'ai'
          ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
          : 'https://avatars.githubusercontent.com/u/76239030?v=4',
      avatarSize: '32px'
    });
  }
  return messages;
}

function createMessage(role: 'user' | 'ai', content: string): listType {
  nextKey += 1;
  const isUser = role === 'user';
  return {
    key: nextKey,
    role,
    placement: isUser ? 'end' : 'start',
    content,
    loading: false,
    shape: 'corner',
    variant: isUser ? 'outlined' : 'filled',
    avatar: isUser
      ? 'https://avatars.githubusercontent.com/u/76239030?v=4'
      : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    avatarSize: '32px'
  };
}

function resetConversation() {
  bubbleItems.value = generateFakeItems(10);
  nextKey = bubbleItems.value.length;
  targetIndex.value = Math.max(bubbleItems.value.length - 1, 0);
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

function addMessage() {
  const i = bubbleItems.value.length;
  const isUser = !!(i % 2);
  const content = isUser
    ? 'Hahaha, let me try'
    : '💖 Thank you for using Element Plus X ! Your support is our strongest motivation for open source ~'.repeat(
        2
      );
  const msg = createMessage(isUser ? 'user' : 'ai', content);
  bubbleItems.value.push(msg);
  targetIndex.value = bubbleItems.value.length - 1;
}

function addUserMessage() {
  const msg = createMessage(
    'user',
    `User follow-up question ${nextKey + 1}: please continue expanding the interaction scenario.`
  );
  bubbleItems.value.push(msg);
  targetIndex.value = bubbleItems.value.length - 1;
}

function addAiMessage() {
  const msg = createMessage(
    'ai',
    `AI latest reply ${nextKey + 1}: verify that when autoScroll is on, messages auto-scroll to the bottom. When off, unread count accumulates and the back-to-bottom button appears.`.repeat(
      (nextKey % 2) + 1
    )
  );
  bubbleItems.value.push(msg);
  targetIndex.value = bubbleItems.value.length - 1;
}

function addBurstMessages() {
  bubbleItems.value.push(
    createMessage(
      'user',
      'Burst append: first insert a short message, observe whether the list anchor stays stable.'
    )
  );
  bubbleItems.value.push(
    createMessage(
      'ai',
      'Second message intentionally longer, to verify scrolling and dynamic height behavior when appending multiple messages at once.'.repeat(
        2
      )
    )
  );
  bubbleItems.value.push(
    createMessage(
      'ai',
      'Third message kept short for easy observation of scroll position sticking to bottom.'
    )
  );
  targetIndex.value = bubbleItems.value.length - 1;
}

function clearMessage() {
  bubbleItems.value = [];
  nextKey = 0;
}

function scrollToTop() {
  bubbleListRef.value?.scrollToTop();
}

function scrollBottom() {
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

onMounted(() => {
  resetConversation();
});
</script>

<template>
  <div class="component-container">
    <div class="tip-banner">
      <span class="tip-icon">i</span>
      <span>
        <strong>V2 auto-scroll rules</strong>: When <code>autoScroll</code> is
        on (default), appending messages auto-scrolls to bottom and unread count
        stays 0.
        <br />
        To experience <strong>unread badge + back-to-bottom button</strong>,
        first <strong>turn off autoScroll</strong> below, then manually scroll
        up and append messages — the view stays still, unread +1, and the
        back-to-bottom button appears. This is the core V2 state machine
        experience.
      </span>
    </div>

    <div class="top-wrap">
      <div class="btn-list" style="align-items: center">
        <span style="font-size: 13px; color: #606266"> autoScroll: </span>
        <el-switch
          v-model="autoScrollEnabled"
          active-text="On (auto-scroll to bottom)"
          inactive-text="Off (accumulate unread)"
        />
      </div>
      <div class="btn-list">
        <el-button type="primary" plain @click="addMessage">
          Add Message
        </el-button>
        <el-button type="primary" plain @click="addUserMessage">
          Append User Message
        </el-button>
        <el-button type="primary" plain @click="addAiMessage">
          Append AI Message
        </el-button>
        <el-button type="warning" plain @click="addBurstMessages">
          Burst Append 3 Messages
        </el-button>
        <el-button type="danger" plain @click="clearMessage">
          Clear Message List
        </el-button>
        <el-button type="primary" plain @click="scrollToTop">
          Scroll to Top
        </el-button>
        <el-button type="success" plain @click="scrollBottom">
          Scroll to Bottom
        </el-button>
        <el-input-number
          v-model="targetIndex"
          :min="0"
          :max="Math.max(bubbleItems.length - 1, 0)"
          controls-position="right"
          size="default"
        />
        <el-button type="primary" plain @click="scrollToBubble">
          Scroll to Bubble {{ targetIndex }}
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
        <span>Total Messages</span>
        <strong>{{ bubbleItems.length }}</strong>
      </div>
      <div class="status-chip">
        <span>Target Index</span>
        <strong>{{ targetIndex }}</strong>
      </div>
    </div>

    <div class="story-stage">
      <BubbleList
        ref="bubbleListRef"
        :list="bubbleItems"
        :auto-scroll="autoScrollEnabled"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.component-container {
  padding: 12px;

  .tip-banner {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 8px;
    background: linear-gradient(135deg, #ecf5ff 0%, #f0f9eb 100%);
    border: 1px solid #d9ecff;
    margin-bottom: 16px;
    font-size: 13px;
    color: #409eff;

    .tip-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: #409eff;
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      flex-shrink: 0;
    }
  }

  .btn-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .top-wrap {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }

  .status-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
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
      font-size: 14px;
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
  }

  .story-stage {
    height: 450px;
    padding: 8px 10px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    overflow: hidden;
  }
}
</style>
