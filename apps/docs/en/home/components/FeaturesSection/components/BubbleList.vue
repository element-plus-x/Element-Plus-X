<!-- 欢迎组件首页演示 -->
<script setup lang="ts">
import type {
  BubbleListItemProps,
  BubbleListProps
} from 'vue-element-plus-x/types/BubbleList';
import { ref } from 'vue';
import { BubbleList } from 'vue-element-plus-x';

type listType = BubbleListItemProps & {
  key: number;
  role: 'user' | 'ai';
};

const avatarUser = ref('https://avatars.githubusercontent.com/u/76239030?v=4');
const avartAi = ref('https://element-plus-x.com/logo.png');

// 示例调用
const bubbleItems = ref<BubbleListProps<listType>['list']>(
  generateFakeItems(2)
);

function generateFakeItems(count: number): listType[] {
  const messages: listType[] = [];
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    const placement = role === 'ai' ? 'start' : 'end';
    const avatar = role === 'ai' ? avartAi.value : avatarUser.value;
    const content =
      role === 'ai' ? '你好，我是 Element Plus X' : '哈哈哈，让我试试用你开发';
    const key = i + 1;
    messages.push({
      key,
      role,
      placement,
      noStyle: true, // 如果你不想用默认的气泡样式
      avatar,
      avatarSize: '32px',
      content
    });
  }
  return messages;
}
</script>

<template>
  <BubbleList :list="bubbleItems">
    <!-- 自定义头像 -->
    <template #avatar="{ item }">
      <div class="avatar-wrapper">
        <img :src="item.avatar" alt="avatar" />
      </div>
    </template>

    <!-- 自定义气泡内容 -->
    <template #content="{ item }">
      <div class="content-wrapper">
        <div
          :class="[
            item.role === 'ai' ? 'text-content-ai' : 'text-content-user'
          ]"
        >
          {{ item.content }}
        </div>
      </div>
    </template>
  </BubbleList>
</template>

<style scoped lang="less">
.card-content-component {
  align-self: center;
  width: calc(100% - 80px);
  margin: 0 40px;
  border-radius: 15px;
  padding: 24px;
  // 旋转45度
  // transform: rotate(5deg);
  box-shadow:
    0 0 15px rgba(0, 255, 255, 0.5),
    /* 青色 */ 0 0 20px rgba(138, 43, 226, 0.4),
    /* 蓝紫 */ 0 0 30px rgba(0, 191, 255, 0.3);
  overflow: hidden;
  background: linear-gradient(
    97deg,
    rgba(90, 196, 255, 0.12) 0%,
    rgba(174, 136, 255, 0.12) 100%
  );

  .avatar-wrapper {
    width: 32px;
    height: 32px;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }

  .content-wrapper {
    .text-content-ai {
      /* 设置字体大小和粗细 */
      font-size: 1.25em;
      font-weight: bold;

      /* 设置渐变背景 */
      background: linear-gradient(45deg, #ff00ff, #00ffff, #ffff00);
      background-size: 300% 300%;

      /* 将背景裁剪为文本形状 */
      -webkit-background-clip: text;
      background-clip: text;

      /* 使文本本身透明，显示背景渐变 */
      color: transparent;

      /* 添加光辉效果 */
      text-shadow:
        0 0 10px rgba(255, 255, 255, 0.8),
        0 0 20px rgba(255, 0, 255, 0.6),
        0 0 30px rgba(0, 255, 255, 0.4);

      /* 添加动画效果使渐变流动 */
      animation: gradientShift 5s ease infinite;
    }

    .text-content-user {
      font-size: 0.875rem;
      /* 文字本身的纯色 */
      color: rgba(0, 255, 255);
    }
  }

  /* 渐变动画 */
  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }
}
</style>
