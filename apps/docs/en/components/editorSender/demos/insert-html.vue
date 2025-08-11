<docs>
---
title: Insert HTML Content
---

Use the component Ref to call the `setHtml` method to insert HTML content at the cursor position.

:::warning
The inserted HTML tags must be inline or inline-block elements. If you need block-level element tags, please insert inline elements and then modify their CSS properties to block-level elements.
:::
</docs>

<script setup lang="ts">
import { ref } from 'vue';

const senderRef = ref();
function setHtml() {
  senderRef.value?.setHtml(
    `<img class="img-tag" src="https://cdn.element-plus-x.com/element-plus-x.png" alt="">`
  );
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button dark type="primary" plain @click="setHtml">
        Insert HTML Content
      </el-button>
    </div>
    <EditorSender ref="senderRef" clearable />
  </div>
</template>

<style scoped lang="less">
:deep(.img-tag) {
  width: 24px;
  height: 24px;
  vertical-align: bottom;
  display: inline-block;
}
</style>
