<docs>
---
title: Insert Custom Tag
---

Configure the custom tag configuration array via the `triggerConfig` property.

Use the component Ref to call the `setTrigger` method to insert **custom tag** content at the cursor position.
</docs>

<script setup lang="ts">
import { reactive } from 'vue';

const senderRef = ref();

const customTagsArr = reactive([
  {
    dialogTitle: 'Topic Tags',
    key: '#',
    options: [
      { id: '1', name: 'Topic 1' },
      { id: '2', name: 'Topic 2' },
      { id: '3', name: 'Topic 3' }
    ]
  },
  {
    dialogTitle: 'File Tags',
    key: '/',
    options: [
      { id: '1', name: 'File 1' },
      { id: '2', name: 'File 2' },
      { id: '3', name: 'File 3' }
    ]
  }
]);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button
        dark
        type="primary"
        plain
        @click="senderRef?.setTrigger('#', '2')"
      >
        Insert Custom Topic Tag
      </el-button>
    </div>

    <EditorSender
      ref="senderRef"
      :trigger-config="customTagsArr"
      placeholder="# triggers topic selection, / triggers file selection"
      clearable
    />
  </div>
</template>

<style scoped lang="less">
</style>
