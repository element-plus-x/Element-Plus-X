<docs>
---
title: 提交方式
---

可以通过 `submitType` 设置输入框的提交方式。
</docs>

<script setup lang="ts">
import type { XSender } from 'vue-element-plus-x';
import type { XSenderProps } from 'vue-element-plus-x/types/XSender';

const submitType = ref<XSenderProps['submitType']>('enter');
const senderLoading = ref(false);
const senderRef = ref<InstanceType<typeof XSender>>();

function handleSubmit() {
  if (senderLoading.value)
    return;

  ElMessage.info(`发送中`);
  senderLoading.value = true;

  setTimeout(() => {
    // 可以在控制台 查看打印结果
    console.log('submit-> value：', senderRef.value?.getModelValue());
    senderLoading.value = false;
    ElMessage.success(`发送成功`);
  }, 2000);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <el-radio-group v-model="submitType">
      <el-radio-button value="enter">
        enter提交
      </el-radio-button>
      <el-radio-button value="shiftEnter">
        shiftEnter提交
      </el-radio-button>
    </el-radio-group>

    <XSender
      ref="senderRef"
      :submit-type="submitType"
      :loading="senderLoading"
      @submit="handleSubmit"
    />
  </div>
</template>
