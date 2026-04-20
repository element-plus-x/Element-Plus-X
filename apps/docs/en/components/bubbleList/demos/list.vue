<docs>
---
title: Basic Usage
---

Quickly render a group of chat bubbles via the `list` array. Each object in the array is passed through to the built-in `Bubble` component — all Bubble properties (`content`, `placement`, `loading`, `shape`, `variant`, etc.) can be configured directly. Adding, removing, or modifying messages only requires maintaining this array.

::: tip
Control the list height via the `max-height` property or the parent container's height — a scrollbar appears automatically when content overflows. See [Bubble docs](/en/components/bubble) for detailed item properties.
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

const list: BubbleListProps<listType>['list'] = generateFakeItems(5);

function generateFakeItems(count: number): listType[] {
  const messages: listType[] = [];
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    const placement = role === 'ai' ? 'start' : 'end';
    const key = i + 1;
    const content =
      role === 'ai'
        ? '💖 Thank you for using Element Plus X ! Your support is our strongest motivation for open source ~'.repeat(
            5
          )
        : `Hahaha, let me try`;
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
      key,
      role,
      placement,
      content,
      loading,
      shape,
      variant,
      isMarkdown,
      typing,
      isFog: role === 'ai',
      avatar,
      avatarSize: '24px',
      avatarGap: '12px'
    });
  }
  return messages;
}
</script>

<template>
  <div class="story-stage">
    <BubbleList :list="list" />
  </div>
</template>

<style scoped lang="scss">
.story-stage {
  height: 450px;
  padding: 8px 10px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}
</style>
