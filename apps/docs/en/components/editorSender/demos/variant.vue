<docs>
---
title: Variant
---

Set the variant of the input box via the `variant` property. [ Default 'default' | Vertical layout 'updown' ]

This property changes the input box from a left-right layout to a vertical layout. The top part is the input box, and the bottom part is the built-in prefix and action list bar.
</docs>

<script setup lang="ts">
import { ElementPlus, Paperclip, Promotion } from '@element-plus/icons-vue';

const isSelect = ref(false);
const tabPosition = ref<'default' | 'updown'>('default');
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px">
    <el-radio-group v-model="tabPosition">
      <el-radio-button value="default"> default </el-radio-button>
      <el-radio-button value="updown"> updown </el-radio-button>
    </el-radio-group>

    <EditorSender :variant="tabPosition" clearable />

    <EditorSender :variant="tabPosition">
      <template #prefix>
        <div
          style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap"
        >
          <el-button round plain color="#626aef">
            <el-icon><Paperclip /></el-icon>
          </el-button>

          <div
            :class="{ isSelect }"
            style="
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 2px 12px;
              border: 1px solid silver;
              border-radius: 15px;
              cursor: pointer;
              font-size: 12px;
            "
            @click="isSelect = !isSelect"
          >
            <el-icon><ElementPlus /></el-icon>
            <span>Deep Thinking</span>
          </div>
        </div>
      </template>

      <template #action-list>
        <div style="display: flex; align-items: center; gap: 8px">
          <el-button round color="#626aef">
            <el-icon><Promotion /></el-icon>
          </el-button>
        </div>
      </template>
    </EditorSender>
  </div>
</template>

<style scoped lang="scss">
.isSelect {
  color: #626aef;
  border: 1px solid #626aef !important;
  border-radius: 15px;
  padding: 3px 12px;
  font-weight: 700;
}
</style>
