<docs>
---
title: Prefix Tip Tag
---

Open and close the prefix tip tag via the `showTip` and `closeTip` methods of the component Ref instance.
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
        @click="
          senderRef?.showTip({
            text: 'Image Generation',
            dialogText: 'Click to exit skill'
          })
        "
      >
        Open Prefix Tip Tag
      </el-button>
      <el-button dark type="primary" plain @click="senderRef?.closeTip()">
        Close Prefix Tip Tag
      </el-button>
    </div>

    <EditorSender ref="senderRef" clearable />
  </div>
</template>

<style scoped lang="less">
:deep(.el-editor-sender-chat) {
  --chat-before-tip-top: -2px !important;
  --chat-tip-dialog-top: 3px !important;
}
</style>
