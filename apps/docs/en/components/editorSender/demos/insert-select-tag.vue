<docs>
---
title: Insert Select Tag
---

Configure the select tag configuration array via the `selectConfig` property.

Use the component Ref to call the `setSelect` method to insert **select tag** content at the cursor position. This method accepts two parameters: the first is the identifier of the select tag, and the second is the option identifier (default value) of the select tag.
</docs>

<script setup lang="ts">
import { reactive } from 'vue';

const senderRef = ref();

const selectConfig = reactive([
  {
    dialogTitle: '风格选择',
    key: 'style',
    multiple: true,
    options: [
      {
        id: '1',
        name: '人像摄影',
        preview: 'https://www.jianfv.top/style/style1.webp'
      },
      {
        id: '2',
        name: '电影写真',
        preview: 'https://www.jianfv.top/style/style2.webp'
      },
      {
        id: '3',
        name: '中国风',
        preview: 'https://www.jianfv.top/style/style3.webp'
      }
    ]
  },
  {
    dialogTitle: '字体选择',
    key: 'font',
    options: [
      { id: '1', name: '宋体' },
      { id: '2', name: '微软雅黑' },
      { id: '3', name: '楷体' }
    ]
  }
]);

function openSelectDialog() {
  senderRef.value?.showSelect('style', document.getElementById('dialogBtn')!);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex">
      <el-button
        dark
        type="primary"
        plain
        @click="senderRef?.setSelect('style', '1')"
      >
        Insert Style Select Tag
      </el-button>
      <el-button
        dark
        type="primary"
        plain
        @click="senderRef?.setSelect('font', '2')"
      >
        Insert Font Select Tag
      </el-button>
      <el-button
        id="dialogBtn"
        dark
        type="primary"
        plain
        @click="openSelectDialog"
      >
        External Call Select Tag Popup
      </el-button>
    </div>
    <EditorSender ref="senderRef" :select-config="selectConfig" clearable />
  </div>
</template>

<style scoped lang="less">
</style>
