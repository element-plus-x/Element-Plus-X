<script setup lang="ts">
import type { ELXButtonProps } from '@components/ELXButton/index.ts';
import { ELXButton } from '../../components';

function logClick(...ags: any[]) {
  console.log(...ags);
}

const elxButtons = ref<ELXButtonProps[]>([
  {
    elxButtonType: 'clear',
    circle: true
  },
  {
    elxButtonType: 'loading',
    circle: true
  },
  {
    elxButtonType: 'send',
    circle: true
  },
  {
    elxButtonType: 'speech',
    circle: true
  },
  {
    elxButtonType: 'speechLoading',
    circle: true
  }
]);

function handleClickEvent(evt: MouseEvent) {
  logClick('点击事件：', evt);
}

function handleSubmitEvent(evt: MouseEvent) {
  logClick('点击事件：', evt);
}

function handleCancelEvent(evt: MouseEvent) {
  logClick('点击事件：', evt);
}

function handleClearEvent(evt: MouseEvent) {
  logClick('点击事件：', evt);
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
