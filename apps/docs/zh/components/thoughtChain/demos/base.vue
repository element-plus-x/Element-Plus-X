<docs>
---
title: thinkingItems 基础使用
---

通过 `thinkingItems` 传入一个数组控制渲染。

::: info
`id` 为必传字段。你还可以通过 `rowKey` 设置唯一标识的名称，默认为 `id`。
:::
</docs>

<script setup lang="ts">
import type { ThoughtChainItemProps } from 'vue-element-plus-x/types/ThoughtChain';

interface DataType {
  codeId: string;
  title?: string;
  thinkTitle?: string;
  thinkContent?: string;
  status?: 'success' | 'loading' | 'error';
}

const thinkingItems: ThoughtChainItemProps<DataType>[] = [
  {
    codeId: '1',
    id: '1',
    status: 'success',
    isCanExpand: true,
    isDefaultExpand: true,
    title: '成功-主标题',
    thinkTitle: '思考内容标题-默认展开',
    thinkContent: '进行搜索文字'.repeat(10)
  },
  {
    codeId: '2',
    id: '2',
    title: '加载中-主标题',
    status: 'loading',
    isCanExpand: true,
    isDefaultExpand: false,
    thinkTitle: '思考内容标题',
    thinkContent: '进行搜索文字'.repeat(10)
  },
  {
    codeId: '3',
    id: '3',
    title: '失败-主标题',
    status: 'error',
    isCanExpand: true,
    isDefaultExpand: false,
    thinkTitle: '思考内容标题',
    thinkContent: '进行搜索文字'.repeat(10)
  },
  {
    codeId: '4',
    id: '4',
    title: '失败-主标题',
    status: 'error',
    isCanExpand: true,
    isDefaultExpand: true,
    thinkTitle: '思考内容标题',
    thinkContent: '进行搜索文字'.repeat(10)
  }
];
</script>

<template>
  <ThoughtChain :thinking-items="thinkingItems" row-key="codeId" />
</template>

<style scoped lang="less"></style>
