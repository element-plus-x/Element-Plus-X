<script setup lang="ts">
import { action } from '@storybook/addon-actions';
import { ELXButton } from '../../components';

function logClick(...ags: any[]) {
  if (arguments.length >= 2) {
    action(ags[0])(...ags.splice(1));
  }
}

function handleClickEvent(evt: MouseEvent) {
  logClick('点击事件：', evt);
}
</script>

<template>
  <div class="elx-button-wrapper">
    <view class="elx-button-row">
      <div>自定义按钮</div>
      <ELXButton v-bind="$attrs" @click="handleClickEvent">
        <span>点点看Actions</span>
      </ELXButton>
    </view>

    <view class="elx-button-row">
      <div>自定义loading slot</div>
      <ELXButton v-bind="$attrs">
        <template #loading>
          <div class="custom-loading">
            <svg class="circular" viewBox="-10, -10, 50, 50">
              <path
                class="path"
                d="
            M 30 15
            L 28 17
            M 25.61 25.61
            A 15 15, 0, 0, 1, 15 30
            A 15 15, 0, 1, 1, 27.99 7.5
            L 15 15
          "
                style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"
              />
            </svg>
          </div>
        </template>
        Loading
      </ELXButton>
    </view>
  </div>
</template>

<style scoped lang="less">
.elx-button-wrapper {
  width: 100%;
  height: 95vh;
  display: flex;
  gap: 10px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .elx-button-row {
    display: flex;
    gap: 10px;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .custom-loading {
    .circular {
      margin-right: 6px;
      width: 18px;
      height: 18px;
      animation: loading-rotate 2s linear infinite;

      .path {
        animation: loading-dash 1.5s ease-in-out infinite;
        stroke-dasharray: 90, 150;
        stroke-dashoffset: 0;
        stroke-width: 2;
        stroke: var(--el-button-text-color);
        stroke-linecap: round;
      }
    }
  }
}
</style>
