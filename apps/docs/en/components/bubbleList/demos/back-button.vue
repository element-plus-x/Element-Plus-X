<docs>
---
title: Back to Bottom Button + Scrollbar Experience
---

- Built-in back to bottom button, similar to `Douyin`.
- Scrollbar appears on mouse hover
- No conflict with built-in auto-scroll, feel free to use

::: info
Scrollbar Control Properties
- `alwaysShowScrollbar` property controls whether to always show scrollbar, default is `false`.

Bottom Button Customization Properties
- You can set the threshold for the back to bottom button through the `backButtonThreshold` property, default is `80`, meaning the back to bottom button will appear when the scrollbar is `80px` away from the bottom.
- `showBackButton` property controls whether to show the back to bottom button, default is `true`.
- `btnLoading` property controls whether to show loading state, default is `true`.
- `btnColor` property controls the color of the back to bottom button, default is `#409EFF`.
- `backButtonPosition` property controls the position of the back to bottom button, default is `{ bottom: '20px', left: 'calc(50% - 19px)' }` can use `%` to control, like `{ bottom: '10%', left: 'calc(50% - 19px)' }`.
- `btnIconSize` property controls the icon size of the back to bottom button, default is `24`.
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
};

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
        ? '💖 Thank you for using Element Plus X ! Your support is our strongest motivation for open source ~'.repeat(
            8
          )
        : `Hahaha, let me try`;
    const loading = false;
    const shape = 'corner';
    const variant = role === 'ai' ? 'filled' : 'outlined';
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
      avatar,
      avatarSize: '24px',
      avatarGap: '12px'
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
        >Scrollbar display:
        <el-switch
          v-model="alwaysShowScrollbar"
          inactive-text="Show on hover"
          active-text="Always show"
      /></span>
      <span
        >Bottom button loading state:
        <el-switch
          v-model="btnLoading"
          inactive-text="false"
          active-text="true"
      /></span>
      <span>Bottom button color: <el-color-picker v-model="btnColor" /></span>

      <span>Bottom button position</span>
      <span>Distance from bottom: <el-slider v-model="bottomValue" /></span>
      <span>Distance from left: <el-slider v-model="leftValue" /></span>

      <span>Bottom button size: <el-slider v-model="btnSize" /></span>
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
