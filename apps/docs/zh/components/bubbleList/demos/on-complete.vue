<docs>
---
title: complete 事件
---

该事件在 BubbleList 列表渲染完成时触发。

::: info
- `@complete` 事件返回 `index` 参数，表示完成的 `BubbleListItem` 的索引。
- 从 v2.0.0 开始，`triggerIndices` 属性和 `TypewriterInstance` 参数已被移除。
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
      avatarSize: '24px'
    });
  }
  return messages;
}

const list = ref<BubbleListProps<listType>['list']>(generateFakeItems(7));

function onComplete(index: number) {
  console.log('@complete', index);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <BubbleList :list="list" max-height="350px" @complete="onComplete" />
  </div>
</template>
