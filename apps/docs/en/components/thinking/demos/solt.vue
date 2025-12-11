<docs>
---
title: Slot Usage
---

The component provides multiple custom slots for developers to customize component styles

- `#status-icon`: Status icon slot
- `#label`: Status text slot
- `#arrow`: Arrow slot
- `#content`: Content slot
- `#error`: Error message slot
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
    content="Welcome to Element-Plus-X"
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
      <span v-if="status === 'start'">Any instructions?</span>
      <span v-else-if="status === 'thinking'">Let me think</span>
      <span v-else-if="status === 'end'">Got it</span>
      <span v-else-if="status === 'error'">Can't figure it out</span>
      <span v-else-if="status === 'cancel'">It's interrupted</span>
    </template>

    <template #arrow>
      <span>👇</span>
    </template>

    <template #content="{ content, status }">
      <span>{{ status }}: {{ content }}</span>
    </template>

    <template #error>
      <span>Sorry, unable to solve your problem</span>
    </template>
  </Thinking>
</template>
