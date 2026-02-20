<docs>
---
title: Basic Usage
---

Pre-styled bubble list, quickly create a chat record through a simple `Array` of messages.

:::warning
You can pass properties to the built-in **`Bubble`** component through the **`item`** property. Set properties for each bubble. More flexible usage. For specific properties, please refer to the [Bubble](https://element-plus-x.com/components/bubble) component documentation.

All our message operations only need to maintain this array.

Including **`streaming message`** settings. Here we don't use interface streaming operations. In our template project, we go through real combat. You can use it as a reference.

👉 [Template Project Preview](https://chat.element-plus-x.com/chat)

👉 [Template Project Source Code](https://github.com/element-plus-x/ruoyi-element-ai) Welcome to star🥰
:::

You can also control the maximum height of the list through the `max-height` property.
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
  <BubbleList :list="list" max-height="350px" />
</template>
