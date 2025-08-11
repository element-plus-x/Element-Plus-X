<docs>
---
title: Insert Text Content
---

Use the component Ref to call the `setText` method to insert text content at the cursor position.
</docs>

<script setup lang="ts">
import { ref } from 'vue';

const senderRef = ref();
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button
        dark
        type="primary"
        plain
        @click="senderRef?.setText('💖 Welcome to Element Plus X ')"
      >
        Insert Text Content
      </el-button>
    </div>
    <EditorSender ref="senderRef" clearable />
  </div>
</template>
