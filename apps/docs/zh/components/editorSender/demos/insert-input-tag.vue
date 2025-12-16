<docs>
---
title: 插入 输入标签
---

使用组件 Ref 调用 `setInput` 方法在光标位置插入 **输入标签** 内容。

这个方法接受三个参数，第一个参数是输入标签的标识（自己定义，在收集数据的时候会进行分类），第二个参数是输入标签的占位符，第三个参数是输入标签的默认值。
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
        @click="senderRef?.setInput('job', '请输入你的职业')"
      >
        插入 不带默认值的输入标签
      </el-button>
      <el-button
        dark
        type="primary"
        plain
        @click="senderRef?.setInput('jop', '请输入你的职业', '开发者')"
      >
        插入 带默认值的输入标签
      </el-button>
    </div>
    <EditorSender ref="senderRef" clearable />
  </div>
</template>

<style scoped lang="less">
</style>
