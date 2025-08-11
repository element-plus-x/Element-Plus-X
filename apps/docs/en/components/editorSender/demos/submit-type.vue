<docs>
---
title: Submit Mode
---

Control line break and submit mode through `submitType`. Default is `'enter'`, which means Enter to submit and `'shift + Enter'` to line break.

::: info
- `submitType='enter'` sets Enter to submit and `'shift + Enter'` to line break.
- `submitType='shiftEnter'` sets `'shift + Enter'` to submit and Enter to line break.
:::
</docs>

<script setup lang="ts">
import type {
  EditorProps,
  SubmitResult
} from 'vue-element-plus-x/types/EditorSender';

const activeName = ref<EditorProps['submitType']>('enter');
const senderLoading = ref(false);
function handleSubmit(value: SubmitResult) {
  ElMessage.info(`Sending`);
  senderLoading.value = true;
  setTimeout(() => {
    // You can check the printed result in the console
    console.log('submit-> value:', value);
    senderLoading.value = false;
    ElMessage.success(`Sent successfully`);
  }, 2000);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-radio-group v-model="activeName">
      <el-radio-button value="enter"> enter </el-radio-button>
      <el-radio-button value="shiftEnter"> shiftEnter </el-radio-button>
    </el-radio-group>

    <EditorSender
      :submit-type="activeName"
      :loading="senderLoading"
      @submit="handleSubmit"
    />
  </div>
</template>
