<docs>
---
title: 自动滚动 + 滚动到指定索引
---

🍑 你可以轻松使用 `bubbleListRef` 组件实例方法，控制 滚动到指定索引。

::: info 🍒 组件实例方法
- `scrollToTop()`：滚动到顶部
- `scrollToBottom()`：滚动到底部
- `scrollToBubble(index: number)`：滚动到指定索引
:::
</docs>

<script setup lang="ts">
import type {
  BubbleListInstance,
  BubbleListItemProps,
  BubbleListProps
} from 'vue-element-plus-x/types/BubbleList';
import type { TypewriterProps } from 'vue-element-plus-x/types/Typewriter';

type listType = BubbleListItemProps & {
  key: number;
  role: 'user' | 'ai';
};

// 示例调用
const bubbleItems = ref<BubbleListProps<listType>['list']>(
  generateFakeItems(2)
);

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
    const loading = false;
    const shape = 'corner';
    const variant = role === 'ai' ? 'filled' : 'outlined';
    const isMarkdown = false;
    const typing = false;
    const avatar =
      role === 'ai'
        ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        : 'https://avatars.githubusercontent.com/u/76239030?v=4';

    messages.push({
      key,
      role,
      placement,
      content,
      loading,
      shape,
      variant,
      isMarkdown,
      typing,
      avatar,
      avatarSize: '32px'
    });
  }
  return messages;
}

const bubbleListRef = ref<BubbleListInstance | null>(null);
const num = ref(0);

function addMessage() {
  const i = bubbleItems.value.length;
  const isUser = !!(i % 2);
  const content = isUser
    ? '哈哈哈，让我试试'
    : '💖 感谢使用 Element Plus X ! 你的支持，是我们开源的最强动力 ~'.repeat(5);
  const shape = 'corner';
  const variant = !isUser ? 'filled' : 'outlined';
  const placement = isUser ? 'end' : 'start';
  const typing: TypewriterProps['typing'] = isUser
    ? false
    : { step: 5, suffix: '🍆', interval: 35 };
  const avatar = isUser
    ? 'https://avatars.githubusercontent.com/u/76239030?v=4'
    : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png';
  const obj = {
    key: i,
    role: isUser ? 'user' : 'ai',
    content,
    placement,
    typing,
    avatar,
    shape,
    variant,
    avatarSize: '32px',
    isFog: !isUser
  };
  bubbleItems.value.push(obj as listType);
  // 每次添加 调用 滚动到底部 触发 自动滚动
  scrollBottom();
}

function clearMessage() {
  bubbleItems.value = [];
}

function scrollToTop() {
  bubbleListRef.value?.scrollToTop();
}

function scrollBottom() {
  bubbleListRef.value?.scrollToBottom();
}

function scrollToBubble() {
  bubbleListRef.value?.scrollToBubble(num.value);
}

onMounted(() => {
  setTimeout(() => {
    bubbleItems.value.map(item => {
      item.loading = false;
      return item;
    });
  }, 3000);
});
</script>

<template>
  <div class="component-container">
    <div class="top-wrap">
      <div class="btn-list">
        <el-button type="primary" plain @click="addMessage">
          添加对话
        </el-button>
        <el-button type="danger" plain @click="clearMessage">
          清空对话列表
        </el-button>
        <el-button type="primary" plain @click="scrollToTop">
          滚动到顶部
        </el-button>
        <el-button type="primary" plain @click="scrollBottom">
          滚动到底部
        </el-button>
      </div>

      <div class="btn-list">
        <el-input-number
          v-model="num"
          :min="0"
          :max="10"
          controls-position="right"
        />
        <el-button type="primary" plain @click="scrollToBubble">
          滚动第{{ num }}个气泡框
        </el-button>
      </div>
    </div>

    <div class="component-1">
      <BubbleList ref="bubbleListRef" :list="bubbleItems" max-height="350px" />
    </div>
  </div>
</template>

<style scoped lang="less">
.component-container {
  padding: 12px;

  .btn-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .top-wrap {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 24px;
  }
}
</style>
