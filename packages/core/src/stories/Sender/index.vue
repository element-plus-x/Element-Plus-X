<script lang="ts" setup>
import type { TriggerEvent } from '@components/Sender/types';
import { action } from '@storybook/addon-actions';
import { ElMessage } from 'element-plus';
import { Sender } from '../../components';

function handleSubmit(value: string) {
  ElMessage.success(`点击了Submit ${value}`);
}
function handleCancel() {
  ElMessage.success(`点击了Cancel`);
}

function handleTrigger(value: TriggerEvent) {
  ElMessage.success(
    `Trigger ${value.oldValue}, ${value.newValue}, ${value.isOpen}`
  );
}
function handleRecordingChange() {
  ElMessage.success(`RecordingChange`);
}

function handleFocus(event: FocusEvent) {
  action('获得焦点')(event);
}

function handleBlur(event: FocusEvent) {
  action('失去焦点')(event);
}
</script>

<template>
  <div class="sender-wrapper">
    <Sender
      v-bind="$attrs"
      @submit="handleSubmit"
      @cancel="handleCancel"
      @focus="handleFocus"
      @blur="handleBlur"
      @trigger="handleTrigger"
      @recording-change="handleRecordingChange"
    />
  </div>
</template>

<style scoped>
.sender-wrapper {
  width: 100%;
  height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
