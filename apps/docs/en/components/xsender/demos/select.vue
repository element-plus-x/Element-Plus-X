<docs>
---
title: 标签选择框
---

可以通过 `setSelect` 插入一个标签选择框提供用户选择预设内容。
使用 `showSelect` 可以基于传入的元素唤起选择弹窗。
使用 `setChatNode` 可以高度预设输入框的模板内容。
</docs>

<script setup lang="ts">
import type { XSender } from 'vue-element-plus-x';
import { ref } from 'vue';

const senderRef = ref<InstanceType<typeof XSender>>();

const selectConfig = ref([
  {
    dialogTitle: '图像风格',
    key: 'style',
    options: [
      {
        id: '1',
        name: '人像摄影',
        preview: 'https://jianfv.top/style/style1.webp'
      },
      {
        id: '2',
        name: '电影写真',
        preview: 'https://jianfv.top/style/style2.webp'
      },
      {
        id: '3',
        name: '中国风',
        preview: 'https://jianfv.top/style/style3.webp'
      }
    ],
    multiple: false // 是否开启多选
  }
]);

function onSetBasic() {
  senderRef.value?.setSelect('style', '1');
}

function openSelectDialog() {
  senderRef.value?.showSelect('style', document.getElementById('target')!);
}

function onSetModel() {
  senderRef.value?.setChatNode([
    [
      {
        type: 'Write',
        text: '请帮我生成一张'
      },
      {
        type: 'Select',
        key: 'style',
        id: '1',
        name: '中国风'
      },
      {
        type: 'Write',
        text: '的图片。'
      }
    ]
  ]);
}
</script>

<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="onSetBasic"> API插入 </el-button>
      <el-button id="target" type="primary" @click="openSelectDialog">
        外部唤起选择弹窗
      </el-button>
      <el-button type="primary" @click="onSetModel">
        预设模版内容插入
      </el-button>
    </div>
    <XSender ref="senderRef" variant="updown" :select-config="selectConfig" />
  </div>
</template>
