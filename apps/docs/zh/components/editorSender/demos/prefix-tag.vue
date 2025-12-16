<docs>
---
title: 前置提示标签
---

通过 组件 Ref 实例的 `showTip` 和 `closeTip` 方法打开和关闭前置提示标签。
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
            text: '图像生成',
            dialogText: '点击退出技能'
          })
        "
      >
        打开前置提示标签
      </el-button>
      <el-button dark type="primary" plain @click="senderRef?.closeTip()">
        关闭前置提示标签
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
