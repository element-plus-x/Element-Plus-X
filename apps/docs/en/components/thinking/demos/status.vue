<docs>
---
title: Status Attribute
---

Set the component state through the `status` attribute. There are four default states: `start`, `thinking`, `end`, `error`
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
        content="Welcome to Element-Plus-X"
        status="start"
      />
    </div>

    <div>
      <Thinking
        v-model="senderValue"
        content="Welcome to Element-Plus-X"
        status="thinking"
      />
    </div>

    <div>
      <Thinking
        v-model="senderValue"
        content="Welcome to Element-Plus-X"
        status="end"
      />
    </div>

    <div>
      <Thinking
        v-model="senderValue"
        content="Welcome to Element-Plus-X"
        status="error"
      />
    </div>

    <div>
      <Thinking
        v-model="senderValue"
        content="Welcome to Element-Plus-X"
        status="cancel"
      />
    </div>
  </div>
</template>

<style scoped lang="less"></style>
