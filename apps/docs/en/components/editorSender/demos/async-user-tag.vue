<docs>
---
title: Async Loading @Mention Example
---

Configure async matching function via `asyncMatchFun` property. `@` triggers user tag popup.
</docs>

<script setup lang="ts">
import { ref } from 'vue';

const senderRef = ref();

// Async match @users
async function asyncMatchUser(searchVal: string) {
  console.log(searchVal, 'content entered after @');
  // Simulate API call, return user list
  return [
    { id: '1', name: 'Zhang San' },
    { id: '2', name: 'Li Si' }
  ];
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <EditorSender
        ref="senderRef"
        placeholder="@ symbol triggers user selection"
        clearable
        :async-match-fun="asyncMatchUser"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
:deep(.at-select) {
  cursor: pointer;
  svg {
    display: inline-block;
  }
}
</style>
