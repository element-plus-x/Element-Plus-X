<docs>
---
title: 回到底部按钮 + 滚动条体验
---

- 内置回到底部按钮，仿 `豆包`。
- 鼠标悬停时，会出现滚动条
- 和内置自动滚动不冲突，请放心使用

::: info
滚动条控制属性
- `alwaysShowScrollbar` 属性控制是否一直显示滚动条，默认为 `false`。

底部按钮定制化属性
- 你可以通过 `backButtonThreshold` 属性来设置回到底部按钮的阈值，默认为 `80`，即当滚动条滚动到距离底部 `80px` 时，才会出现回到底部按钮。
- `showBackButton` 属性控制是否显示回到底部按钮，默认为 `true`。
- `btnLoading` 属性控制是否显示加载中的状态，默认为 `true`。
- `btnColor` 属性控制回到底部按钮的颜色，默认为 `#409EFF`。
- `backButtonPosition` 属性控制回到底部按钮的位置，默认为 `{ bottom: '20px', left: 'calc(50% - 19px)' }` 可以用 `%` 来控制，如 `{ bottom: '10%', left: 'calc(50% - 19px)' }`。
- `btnIconSize` 属性控制回到底部按钮的图标大小，默认为 `24`。
:::
</docs>

<script setup lang="ts">
import type {
  BubbleListItemProps,
  BubbleListProps
} from 'vue-element-plus-x/types/BubbleList';

type listType = BubbleListItemProps & {
  key: number;
  role: 'user' | 'ai';
  isMarkdown?: boolean;
  typing?: boolean;
  isFog?: boolean;
};

// 示例调用
const list: BubbleListProps<listType>['list'] = generateFakeItems(12);
const alwaysShowScrollbar = ref(false);
const btnLoading = ref(true);
const bottomValue = ref(10);
const leftValue = ref(85);
const backButtonPosition = computed(() => {
  return {
    bottom: `${bottomValue.value}%`,
    left: `${leftValue.value}%`
  };
});
const btnColor = ref('#2D38FF');
const btnSize = ref(40);

function generateFakeItems(count: number): listType[] {
  const messages: listType[] = [];
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    const placement = role === 'ai' ? 'start' : 'end';
    const key = i + 1;
    const content =
      role === 'ai'
        ? '💖 感谢使用 Element Plus X ! 你的支持，是我们开源的最强动力 ~'.repeat(
            8
          )
        : `哈哈哈，让我试试`;
    const loading = false;
    const shape = 'corner';
    const variant = role === 'ai' ? 'filled' : 'outlined';
    const isMarkdown = false;
    const typing = role === 'ai' ? i === count - 1 : false;
    const avatar =
      role === 'ai'
        ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        : 'https://avatars.githubusercontent.com/u/76239030?v=4';

    messages.push({
      key, // 唯一标识
      role, // user | ai 自行更据模型定义
      placement, // start | end 气泡位置
      content, // 消息内容 流式接受的时候，只需要改这个值即可，这里暂时没有用到流式数据
      loading, // 当前气泡的加载状态
      shape, // 气泡的形状
      variant, // 气泡的样式
      isMarkdown, // 是否渲染为 markdown
      typing, // 是否开启打字器效果 该属性不会和流式接受冲突
      isFog: role === 'ai', // 是否开启打字雾化效果，该效果 v1.1.6 新增，且在 typing 为 true 时生效，该效果会覆盖 typing 的 suffix 属性
      avatar,
      avatarSize: '24px', // 头像占位大小
      avatarGap: '12px' // 头像与气泡之间的距离
    });
  }
  return messages;
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px">
    <div
      style="
        display: flex;
        gap: 5px;
        border: 1px solid gray;
        border-radius: 12px;
        padding: 8px;
        flex-direction: column;
      "
    >
      <span
        >滚动条显示：<el-switch
          v-model="alwaysShowScrollbar"
          inactive-text="鼠标悬停展示"
          active-text="一直展示"
      /></span>
      <span
        >底部按钮加载状态：<el-switch
          v-model="btnLoading"
          inactive-text="false"
          active-text="true"
      /></span>
      <span>底部按钮颜色： <el-color-picker v-model="btnColor" /></span>

      <span>底部按钮位</span>
      <span>距离底部：<el-slider v-model="bottomValue" /></span>
      <span>距离左边：<el-slider v-model="leftValue" /></span>

      <span>底部按钮尺寸：<el-slider v-model="btnSize" /></span>
    </div>

    <BubbleList
      :list="list"
      max-height="350px"
      :always-show-scrollbar="alwaysShowScrollbar"
      :btn-color="btnColor"
      :btn-loading="btnLoading"
      :back-button-position="backButtonPosition"
      :btn-icon-size="btnSize"
    />
  </div>
</template>
