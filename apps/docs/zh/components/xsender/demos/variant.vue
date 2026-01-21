<docs>
---
title: 输入框布局变体
---

通过 `variant` 属性设置输入框的变体。默认 'default' | 上下结构 'updown'

这个属性，将左右结构的 输入框，变成 上下结构的 输入框。上面为 输入框，下面为 内置的 前缀和操作列表栏
</docs>

<script setup lang="ts">
import type { XSenderProps } from 'vue-element-plus-x/types/XSender';
import { Paperclip, Promotion } from '@element-plus/icons-vue';
import { ref } from 'vue';

const variant = ref<XSenderProps['variant']>('default');
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px">
    <el-radio-group v-model="variant">
      <el-radio-button value="default">
        default
      </el-radio-button>
      <el-radio-button value="updown">
        updown
      </el-radio-button>
    </el-radio-group>

    <XSender :variant="variant" clearable />

    <XSender
      :variant="variant"
      placeholder="💌 在这里你可以自定义变体后的 prefix 和 action-list"
    >
      <template #prefix>
        <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap">
          <el-button round plain color="#626aef">
            <el-icon><Paperclip /></el-icon>
          </el-button>
        </div>
      </template>

      <template #action-list>
        <div style="display: flex; align-items: center; gap: 8px">
          <el-button round color="#626aef">
            <el-icon><Promotion /></el-icon>
          </el-button>
        </div>
      </template>
    </XSender>
  </div>
</template>
