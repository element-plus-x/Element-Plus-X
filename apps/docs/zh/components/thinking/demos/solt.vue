<docs>
---
title: 插槽使用
---

组件提供多个自定义插槽，方便开发者自定义组件样式

- `#status-icon`: 状态图标插槽
- `#label`: 状态文字插槽
- `#arrow`: 箭头插槽
- `#content`: 内容插槽
- `#error`: 错误提示插槽
</docs>

<script setup lang="ts">
const statusValue = ref('start');
</script>

<template>
  <el-radio-group v-model="statusValue" style="margin-bottom: 12px">
    <el-radio-button value="start"> start </el-radio-button>
    <el-radio-button value="thinking"> thinking </el-radio-button>
    <el-radio-button value="end"> end </el-radio-button>
    <el-radio-button value="error"> error </el-radio-button>
    <el-radio-button value="cancel"> cancel </el-radio-button>
  </el-radio-group>

  <Thinking
    :status="statusValue"
    content="欢迎使用 Element-Plus-X"
    button-width="250px"
    max-width="100%"
  >
    <template #status-icon="{ status }">
      <span v-if="status === 'start'">😄</span>
      <span v-else-if="status === 'error'">😭</span>
      <span v-else-if="status === 'thinking'">🤔</span>
      <span v-else-if="status === 'end'">😊</span>
      <span v-else-if="status === 'cancel'">🤐</span>
    </template>

    <template #label="{ status }">
      <span v-if="status === 'start'">有什么指示嘛？</span>
      <span v-else-if="status === 'thinking'">容我想想</span>
      <span v-else-if="status === 'end'">想出来了</span>
      <span v-else-if="status === 'error'">想不出来</span>
      <span v-else-if="status === 'cancel'">中断啦</span>
    </template>

    <template #arrow>
      <span>👇</span>
    </template>

    <template #content="{ content, status }">
      <span>{{ status }}: {{ content }}</span>
    </template>

    <template #error>
      <span>抱歉，无法解决您的问题</span>
    </template>
  </Thinking>
</template>
