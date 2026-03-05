<docs>
---
title: handleExpand Event
---

Through the handleExpand event, you can get the currently expanded node data.
</docs>

<script setup lang="ts">
import type { ThoughtChainItemProps } from 'vue-element-plus-x/types/ThoughtChain';

interface DataType {
  codeId: string;
  self_title?: string;
  self_thinkTitle?: string;
  self_thinkContent?: string;
  status?: 'success' | 'loading' | 'error';
}

const thinkingItems: ThoughtChainItemProps<DataType>[] = [
  {
    codeId: '1',
    id: '1',
    status: 'success',
    isCanExpand: true,
    isDefaultExpand: true,
    self_title: 'Success - Main Title',
    self_thinkTitle: 'Thinking Content Title - Default Expanded',
    self_thinkContent: 'Search text'.repeat(10),
    thinkContent: 'Search text'.repeat(10)
  },
  {
    codeId: '2',
    id: '2',
    self_title: 'Loading - Main Title',
    status: 'loading',
    isCanExpand: true,
    isDefaultExpand: false,
    self_thinkTitle: 'Thinking Content Title',
    self_thinkContent: 'Search text'.repeat(10),
    thinkContent: 'Search text'.repeat(10)
  },
  {
    codeId: '3',
    id: '3',
    self_title: 'Failed - Main Title',
    status: 'error',
    isCanExpand: true,
    isDefaultExpand: false,
    self_thinkTitle: 'Thinking Content Title',
    self_thinkContent: 'Search text'.repeat(10),
    thinkContent: 'Search text'.repeat(10)
  },
  {
    codeId: '4',
    id: '4',
    self_title: 'Thank You - Main Title',
    status: 'success',
    isCanExpand: true,
    isDefaultExpand: true,
    self_thinkTitle: 'Thinking Content Title',
    self_thinkContent: 'Search text'.repeat(10),
    thinkContent: 'Search text'.repeat(10)
  }
];

function handleExpand(item: ThoughtChainItemProps<DataType>) {
  console.log(item);
}
</script>

<template>
  <ThoughtChain
    :thinking-items="thinkingItems"
    row-key="codeId"
    title-key="self_title"
    think-title-key="self_thinkTitle"
    think-content-key="self_thinkContent"
    @handle-expand="handleExpand"
  />
</template>

<style scoped lang="less">
.is-loading {
  animation: spin 1s infinite linear;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
