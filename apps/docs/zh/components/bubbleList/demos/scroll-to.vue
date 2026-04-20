<docs>
---
title: 滚动控制方法
---

通过组件实例的三个方法精确控制滚动位置：`scrollToTop()`、`scrollToBottom()`、`scrollToBubble(index)`，均支持传入 `smooth` 参数控制是否平滑滚动。

同时暴露 `currentScrollState` 和 `currentUnreadCount` 实例属性，也可监听 `@scroll-state-change` / `@unread-count-change` 事件实时感知状态（`AT_BOTTOM` / `SCROLLED_UP` / `HAS_NEW_MESSAGES`）。
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
        ? '💖 感谢使用 Element Plus X ! 你的支持，是我们开源的最强动力 ~'
        : `哈哈哈，让我试试`;
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
    ? '哈哈哈，让我试试'
    : '💖 感谢使用 Element Plus X ! 你的支持，是我们开源的最强动力 ~'.repeat(2);
  const msg = createMessage(isUser ? 'user' : 'ai', content);
  bubbleItems.value.push(msg);
  targetIndex.value = bubbleItems.value.length - 1;
}

function addUserMessage() {
  const msg = createMessage(
    'user',
    `用户补充问题 ${nextKey + 1}：请继续展开交互场景。`
  );
  bubbleItems.value.push(msg);
  targetIndex.value = bubbleItems.value.length - 1;
}

function addAiMessage() {
  const msg = createMessage(
    'ai',
    `AI 最新回复 ${nextKey + 1}：验证 autoScroll 开启时，消息自动滚动到底部。关闭后改为累计未读并显示回底按钮。`.repeat(
      (nextKey % 2) + 1
    )
  );
  bubbleItems.value.push(msg);
  targetIndex.value = bubbleItems.value.length - 1;
}

function addBurstMessages() {
  bubbleItems.value.push(
    createMessage('user', '连续追加：先插入一条短消息，观察列表锚点是否稳定。')
  );
  bubbleItems.value.push(
    createMessage(
      'ai',
      '第二条刻意拉长内容，验证多条消息一起追加时的滚动与动态高度表现。'.repeat(
        2
      )
    )
  );
  bubbleItems.value.push(
    createMessage('ai', '第三条保持较短，便于手动观察滚动位置是否贴底。')
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
        <strong>V2 自动追底规则</strong>：<code>autoScroll</code>
        开启时（默认），追加消息会自动触底，未读计数始终为 0。
        <br />
        如需体验<strong>未读角标 + 回底按钮</strong>，请先将下方开关<strong
          >关闭 autoScroll</strong
        >，再手动向上滚动后追加消息——视图不动、未读 +1、回底按钮浮现，这正是 V2
        状态机的核心体验。
      </span>
    </div>

    <div class="top-wrap">
      <div class="btn-list" style="align-items: center">
        <span style="font-size: 13px; color: #606266"> autoScroll： </span>
        <el-switch
          v-model="autoScrollEnabled"
          active-text="开启（自动追底）"
          inactive-text="关闭（累计未读）"
        />
      </div>
      <div class="btn-list">
        <el-button type="primary" plain @click="addMessage">
          添加对话
        </el-button>
        <el-button type="primary" plain @click="addUserMessage">
          追加用户消息
        </el-button>
        <el-button type="primary" plain @click="addAiMessage">
          追加 AI 消息
        </el-button>
        <el-button type="warning" plain @click="addBurstMessages">
          连续追加 3 条
        </el-button>
        <el-button type="danger" plain @click="clearMessage">
          清空对话列表
        </el-button>
        <el-button type="primary" plain @click="scrollToTop">
          滚动到顶部
        </el-button>
        <el-button type="success" plain @click="scrollBottom">
          滚动到底部
        </el-button>
        <el-input-number
          v-model="targetIndex"
          :min="0"
          :max="Math.max(bubbleItems.length - 1, 0)"
          controls-position="right"
          size="default"
        />
        <el-button type="primary" plain @click="scrollToBubble">
          滚到第{{ targetIndex }}个气泡
        </el-button>
        <el-button type="info" plain @click="resetConversation">
          重置会话
        </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-chip">
        <span>滚动状态</span>
        <strong :class="`state-${scrollState.toLowerCase()}`">{{
          scrollState
        }}</strong>
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
