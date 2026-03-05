<docs>
---
title: 基础使用
---

预设样式的气泡列表，通过一个消息简单的 `Array` ，可以快速创建一个聊天记录。

:::warning
可以通过 **`item`** 属性来透传给组件内置的 **`Bubble`** 组件。设置每一个气泡的属性。更灵活的使用方式。具体属性可以访问 [Bubble](https://element-plus-x.com/components/bubble) 组件的文档。

我们所有的消息操作，只需要维护这个数组就行了。

包括 **`流式消息`** 的设置。这里没有使用接口流式操作。在我们的模版项目中，走了实战。可以当做一个参考。

👉 [模版项目预览地址](https://chat.element-plus-x.com/chat)

👉 [模版项目源码地址](https://github.com/element-plus-x/ruoyi-element-ai) 欢迎star🥰
:::

你还可以通过属性 `max-height` 来控制列表的最大高度。
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
const list: BubbleListProps<listType>['list'] = generateFakeItems(5);

function generateFakeItems(count: number): listType[] {
  const messages: listType[] = [];
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    const placement = role === 'ai' ? 'start' : 'end';
    const key = i + 1;
    const content =
      role === 'ai'
        ? '💖 感谢使用 Element Plus X ! 你的支持，是我们开源的最强动力 ~'.repeat(
            5
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
      content, // 消息内容 流式接受的时候，只需要改这个值即可
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
  <BubbleList :list="list" max-height="350px" />
</template>
