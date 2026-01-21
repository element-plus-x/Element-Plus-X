<docs>
---
title: 操作列表插槽
---

通过 `#action-list` 插槽用于自定义输入框的操作列表内容。

::: info
当你使用 `#action-list` 插槽时，会隐藏内置的输入框的操作按钮。你可以通过和 `组件实例方法` 相结合，实现更丰富的操作。
:::
</docs>

<script setup lang="ts">
import type { XSender } from 'vue-element-plus-x';
import {
  Delete,
  Promotion
} from '@element-plus/icons-vue';

const senderRef = ref<InstanceType<typeof XSender>>();

function handleDelete() {
  senderRef.value?.clear();
}

function handleSubmit() {
  console.log(senderRef.value?.getModelValue());
  handleDelete();
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <XSender
      ref="senderRef"
      variant="updown"
    >
      <!-- 自定义 操作列表插槽 -->
      <template #action-list>
        <div style="display: flex; align-items: center;">
          <el-button round plain color="#626aef" @click="handleDelete">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button round plain color="#626aef" @click="handleSubmit">
            <el-icon><Promotion /></el-icon>
          </el-button>
        </div>
      </template>
    </XSender>
  </div>
</template>
