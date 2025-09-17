<script setup lang="ts">
import type { ELXButtonProps } from '@components/ELXButton/index.ts';
import { action } from '@storybook/addon-actions';
import { ELXButton } from '../../components';

function logClick(...ags: any[]) {
  if (arguments.length >= 2) {
    action(ags[0])(...ags.splice(1));
  }
}

const elxButtons = ref<ELXButtonProps[]>([
  {
    elxButtonType: 'clear'
  },
  {
    elxButtonType: 'loading'
  },
  {
    elxButtonType: 'send'
  },
  {
    elxButtonType: 'speech'
  },
  {
    elxButtonType: 'speechLoading'
  }
]);

function handleClickEvent(evt: MouseEvent) {
  logClick('@click 点击事件：', evt);
}

function handleSubmitEvent(evt: MouseEvent) {
  logClick('@submit 点击事件：', evt);
}

function handleCancelEvent(evt: MouseEvent) {
  logClick('@cancel 点击事件：', evt);
}

function handleClearEvent(evt: MouseEvent) {
  logClick('@clear 点击事件：', evt);
}
</script>

<template>
  <div class="elxButton-wrapper">
    <ELXButton
      v-for="(item, index) in elxButtons"
      :key="index"
      v-bind="{ ...$attrs, ...item }"
      @click="handleClickEvent"
      @submit="handleSubmitEvent"
      @cancel="handleCancelEvent"
      @clear="handleClearEvent"
    />
  </div>
</template>

<style scoped lang="less">
.elxButton-wrapper {
  width: 100%;
  height: 95vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
