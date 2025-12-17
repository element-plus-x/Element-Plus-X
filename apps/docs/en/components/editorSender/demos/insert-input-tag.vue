<docs>
---
title: Insert Input Tag
---
Use the component Ref to call the `setInput` method to insert **input tag** content at the cursor position.

This method accepts three parameters: the first is the identifier of the input tag (custom defined), the second is the placeholder of the input tag, and the third is the default value of the input tag.
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
        @click="senderRef?.setInput('job', 'Please enter your occupation')"
      >
        Insert Input Tag Without Default Value
      </el-button>
      <el-button
        dark
        type="primary"
        plain
        @click="
          senderRef?.setInput(
            'job',
            'Please enter your occupation',
            'Developer'
          )
        "
      >
        Insert Input Tag With Default Value
      </el-button>
    </div>
    <EditorSender ref="senderRef" clearable />
  </div>
</template>

<style scoped lang="less">
</style>
