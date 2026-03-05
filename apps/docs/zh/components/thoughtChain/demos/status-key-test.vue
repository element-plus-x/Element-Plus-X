<docs>
---
title: statusKey、statusEnum 属性
---

通过 `statusKey` 、`statusEnum` 设置 状态字段 和 状态字段的对应 内置样式枚举值。

左侧 dot 节点的样式由 `statusKey` 和 `statusEnum` 配置决定。
</docs>

<script setup lang="ts">
import type { ThoughtChainItemProps } from 'vue-element-plus-x/types/ThoughtChain';

interface DataType {
  codeId: string;
  title?: string;
  thinkTitle?: string;
  thinkContent?: string;
  self_status?: 'yes' | 'no' | 'load';
}

const thinkingItems: ThoughtChainItemProps<DataType>[] = [
  {
    codeId: '1',
    id: '1',
    self_status: 'yes',
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
    self_status: 'load',
    isCanExpand: true,
    isDefaultExpand: false,
    thinkTitle: '思考内容标题',
    thinkContent: '进行搜索文字'.repeat(10)
  },
  {
    codeId: '3',
    id: '3',
    title: '失败-主标题',
    self_status: 'no',
    isCanExpand: true,
    isDefaultExpand: false,
    thinkTitle: '思考内容标题',
    thinkContent: '进行搜索文字'.repeat(10)
  },
  {
    codeId: '4',
    id: '4',
    title: '谢谢-主标题',
    isCanExpand: true,
    isDefaultExpand: true,
    thinkTitle: '思考内容标题',
    thinkContent: '进行搜索文字'.repeat(10)
  }
];
</script>

<template>
  <ThoughtChain
    :thinking-items="thinkingItems"
    row-key="codeId"
    status-key="self_status"
    :status-enum="{
      loading: { value: 'load', type: 'warning' },
      error: { value: 'no', type: 'success' },
      success: { value: 'yes', type: 'danger' }
    }"
  >
    <template #icon="{ item }">
      <span>{{ console.log(item) }}</span>
    </template>
  </ThoughtChain>
</template>

<style scoped lang="less"></style>
