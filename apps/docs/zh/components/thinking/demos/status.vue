<docs>
---
title: status 属性
---

通过 `status` 属性设置组件的状态，一共有四个默认状态，分别是 `start`、`thinking`、`end`、`error`
</docs>

<script setup lang="ts">
const senderValue = ref(false);
</script>

<template>
  <div
    style="
      display: flex;
      gap: 10px;
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
    "
  >
    <div>
      <Thinking
        v-model="senderValue"
        content="欢迎使用 Element-Plus-X"
        status="start"
      />
    </div>

    <div>
      <Thinking
        v-model="senderValue"
        content="欢迎使用 Element-Plus-X"
        status="thinking"
      />
    </div>

    <div>
      <Thinking
        v-model="senderValue"
        content="欢迎使用 Element-Plus-X"
        status="end"
      />
    </div>

    <div>
      <Thinking
        v-model="senderValue"
        content="欢迎使用 Element-Plus-X"
        status="error"
      />
    </div>

    <div>
      <Thinking
        v-model="senderValue"
        content="欢迎使用 Element-Plus-X"
        status="cancel"
      />
    </div>
  </div>
</template>

<style scoped lang="less"></style>
