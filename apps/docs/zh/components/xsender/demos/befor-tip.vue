<docs>
---
title: 前置提示词
---

默认可以通过自定义设置触发符触发选择弹窗。
可以通过 `setTrigger` 插入一个提及用户标签。
使用 `setChatNode` 可以高度预设输入框的模板内容。
</docs>

<script setup lang="ts">
import type { XSender } from 'vue-element-plus-x';
import { reactive, ref } from 'vue';

const senderRef = ref<InstanceType<typeof XSender>>();

const tipConfig = reactive({
  offsetTop: -3
});

function onOpen() {
  senderRef.value?.showTip({
    text: '图像生成',
    dialogText: '点击退出技能'
  });
}

function onClose() {
  senderRef.value?.closeTip();
}
</script>

<template>
  <div style="margin-bottom: 20px;">
    <el-button type="primary" @click="onOpen">打开前置标签</el-button>
    <el-button type="primary" @click="onClose">关闭前置标签</el-button>
  </div>
  <div style="margin-bottom: 20px;">
    <span>前置标签状态：{{ senderRef?.senderState.tipShow }}</span>
  </div>
  <XSender
    ref="senderRef"
    :tip-config="tipConfig"
  ></XSender>
</template>
