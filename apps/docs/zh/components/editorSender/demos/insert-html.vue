<docs>
---
title: 插入 html 内容
---

使用组件 Ref 调用 `setHtml` 方法在光标位置插入 html 内容。
</docs>

<script setup lang="ts">
import { ref } from 'vue';

const senderRef = ref();
function setHtml() {
  senderRef.value?.setHtml(
    `<span style="color: #40A9FF">💖 欢迎来到 Element Plus X </span>`
  );
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button dark type="primary" plain @click="setHtml">
        插入 html 内容
      </el-button>
    </div>
    <EditorSender ref="senderRef" clearable />
  </div>
</template>

<style scoped lang="less">
</style>
