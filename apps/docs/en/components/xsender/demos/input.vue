<docs>
---
title: Input
---

Use `setInput` to insert an input field for preset values.
Use `setChatNode` to preset template content for the input.
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
      <el-button type="primary" @click="onSetBasic"> 基础插入 </el-button>
      <el-button type="primary" @click="onSetValue"> 定义默认值插入 </el-button>
      <el-button type="primary" @click="onSetModel">
        预设模板内容插入
      </el-button>
    </div>
    <XSender ref="senderRef" variant="updown" />
  </div>
</template>
