<docs>
---
title: #icon 插槽
---

通过 `#icon` 插槽，可以自定义 不同状态的 图标。 通过 `#icon={item}` 可以获取到当前状态。
</docs>

<script setup lang="ts">
import type { ThoughtChainItemProps } from 'vue-element-plus-x/types/ThoughtChain';
import {
  CircleCloseFilled,
  Loading,
  SuccessFilled
} from '@element-plus/icons-vue';

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
  >
    <template #icon="{ item }">
      <span
        v-if="item.status === 'success'"
        style="
          font-size: 18px;
          margin-left: 7px;
          color: var(--el-color-success);
        "
      >
        <el-icon><SuccessFilled /></el-icon>
      </span>
      <span
        v-if="item.status === 'error'"
        style="font-size: 18px; margin-left: 7px; color: var(--el-color-danger)"
      >
        <el-icon><CircleCloseFilled /></el-icon>
      </span>
      <span
        v-if="item.status === 'loading'"
        style="font-size: 18px; margin-left: 7px"
      >
        <el-icon class="is-loading"><Loading /></el-icon>
      </span>
    </template>
  </ThoughtChain>
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
