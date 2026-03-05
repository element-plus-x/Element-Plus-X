<docs>
---
title: titleKey、thinkTitleKey、thinkContentKey 属性
---

通过 `titleKey`、`thinkTitleKey`、`thinkContentKey` 属性，可以自定义节点的：标题、思考内容标题、思考内容 的 key 名称。
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
    self_title: '成功-主标题',
    self_thinkTitle: '思考内容标题-默认展开',
    self_thinkContent: '进行搜索文字'.repeat(10),
    thinkContent: 'Search text'.repeat(10)
  },
  {
    codeId: '2',
    id: '2',
    self_title: '加载中-主标题',
    status: 'loading',
    isCanExpand: true,
    isDefaultExpand: false,
    self_thinkTitle: '思考内容标题',
    self_thinkContent: '进行搜索文字'.repeat(10),
    thinkContent: 'Search text'.repeat(10)
  },
  {
    codeId: '3',
    id: '3',
    self_title: '失败-主标题',
    status: 'error',
    isCanExpand: true,
    isDefaultExpand: false,
    self_thinkTitle: '思考内容标题',
    self_thinkContent: '进行搜索文字'.repeat(10),
    thinkContent: 'Search text'.repeat(10)
  },
  {
    codeId: '4',
    id: '4',
    self_title: '谢谢-主标题',
    status: 'success',
    isCanExpand: true,
    isDefaultExpand: true,
    self_thinkTitle: '思考内容标题',
    self_thinkContent: '进行搜索文字'.repeat(10),
    thinkContent: 'Search text'.repeat(10)
  }
];
</script>

<template>
  <ThoughtChain
    :thinking-items="thinkingItems"
    row-key="codeId"
    title-key="self_title"
    think-title-key="self_thinkTitle"
    think-content-key="self_thinkContent"
  />
</template>

<style scoped lang="less"></style>
