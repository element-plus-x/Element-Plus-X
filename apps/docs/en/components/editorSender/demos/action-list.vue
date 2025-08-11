<docs>
---
title: Action List Slot
---

Use the `#action-list` slot to customize the action list content of the input box. You can combine it with the `getCurrentValue` method of the component Ref instance to get the current value of the input box.

::: warning
Before version `1.0.81`, when using custom slots, the built-in action buttons would be sacrificed. In version `1.0.81`, we introduced streaming request hooks that allow users to better control streaming requests and thus better define their own `#action-list` slots. For details, please check out our project template's recommended request library, comparable to Axios: [hook-fetch](https://www.npmjs.com/package/hook-fetch).

This friendly reminder was updated on: `2025-08-06`
:::

::: info
When you use the `#action-list` slot, the built-in input box action buttons will be hidden. You can combine it with `component instance methods` to implement richer operations.
:::
</docs>

<script setup lang="ts">
import { Loading, Position } from '@element-plus/icons-vue';

const senderRef = ref();
const loading = ref(false);

function handleSubmit() {
  // Get the current content of the input box
  const senderValue = senderRef.value.getCurrentValue();
  console.log('senderValue', senderValue);
  if (!senderValue.text) {
    ElMessage.warning('Please enter content');
    return;
  }
  loading.value = true;
}

function handleCancel() {
  console.log('cancel');
  loading.value = false;
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <EditorSender ref="senderRef">
      <!-- Custom action list -->
      <template #action-list>
        <div class="action-list-self-wrap">
          <el-button
            v-if="loading"
            type="primary"
            plain
            circle
            @click="handleCancel"
          >
            <el-icon class="is-loaidng">
              <Loading />
            </el-icon>
          </el-button>

          <el-button v-else plain circle @click="handleSubmit">
            <el-icon><Position /></el-icon>
          </el-button>
        </div>
      </template>
    </EditorSender>
  </div>
</template>

<style scoped lang="less">
.action-list-self-wrap {
  display: flex;
  align-items: center;
  & > span {
    width: 120px;
    font-weight: 600;
    color: var(--el-color-primary);
  }
}

.is-loaidng {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
