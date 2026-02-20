<docs>
---
title: complete Event
---

This event is triggered when the BubbleList list rendering is complete.

::: info
- The `@complete` event returns an `index` parameter, indicating the index of the completed `BubbleListItem`.
- Starting from v2.0.0, the `triggerIndices` property and `TypewriterInstance` parameter have been removed.
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
        ? '💖 Thank you for using Element Plus X ! Your support is our strongest motivation for open source ~'
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
