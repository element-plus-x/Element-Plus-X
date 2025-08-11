<docs>
---
title: Prefix Tip Tag
---

Open and close the prefix tip tag via the `openTipTag` and `closeTipTag` methods of the component Ref instance.
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
          senderRef?.openTipTag({
            tagLabel: 'Image Generation',
            popoverLabel: 'Click to exit skill'
          })
        "
      >
        Open Prefix Tip Tag
      </el-button>
      <el-button dark type="primary" plain @click="senderRef?.closeTipTag()">
        Close Prefix Tip Tag
      </el-button>
    </div>

    <EditorSender ref="senderRef" clearable />
  </div>
</template>

<style scoped lang="less">
:deep(.at-select) {
  cursor: pointer;

  svg {
    display: inline-block;
  }
}

:deep(.img-tag) {
  width: 24px;
  height: 24px;
  vertical-align: bottom;
  display: inline-block;
}

/* Style penetration to solve spacing issue between prefix tag and input content */
:deep(.el-editor-sender-content) {
  padding-top: 0 !important;
  .el-editor-sender-chat,
  .chat-tip-wrap,
  .chat-placeholder-wrap,
  .el-editor-sender-action-list-presets {
    padding-top: 12px !important;
  }
}
</style>
