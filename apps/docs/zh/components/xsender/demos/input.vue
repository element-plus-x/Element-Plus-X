<docs>
---
title: 词槽输入框
---

可以通过 `setInput` 插入一个词槽输入框提供用户填写输入预设内容。
使用 `setChatNode` 可以高度预设输入框的模板内容。
</docs>

<script setup lang="ts">
import type { XSender } from 'vue-element-plus-x';
import { ref } from 'vue';

const senderRef = ref<InstanceType<typeof XSender>>();

function onSetBasic() {
  senderRef.value?.setInput('job', '请输入职业');
}
function onSetValue() {
  senderRef.value?.setInput('job', '请输入职业', '前端工程师');
}
function onSetModel() {
  senderRef.value?.setChatNode([
    [
      {
        type: 'Write',
        text: '请帮我改写以下内容：'
      },
      {
        type: 'Input',
        key: 'target',
        placeholder: '这里输入要扩写的内容'
      }
    ],
    [
      {
        type: 'Write',
        text: '扩写要求是：'
      },
      {
        type: 'Input',
        key: 'target',
        placeholder: '这里输入要扩写的重点或要求，如扩写的主题、字数要求'
      }
    ]
  ]);
}
</script>

<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="onSetBasic">基础插入</el-button>
      <el-button type="primary" @click="onSetValue">定义默认值插入</el-button>
      <el-button type="primary" @click="onSetModel">预设模板内容插入</el-button>
    </div>
    <XSender
      ref="senderRef"
      variant="updown"
    ></XSender>
  </div>
</template>
