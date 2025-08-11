<docs>
---
title: Footer Slot
---

Set the footer content of the input box through the `#footer` slot
</docs>

<script setup lang="ts">
import { ElementPlus, Paperclip, Promotion } from '@element-plus/icons-vue';

const isSelect = ref(false);
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 20px">
    <EditorSender clearable>
      <template #prefix>
        <div
          style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap"
        >
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

      <!-- Custom Footer Slot -->
      <template #footer>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
          "
        >
          Default Variant Custom Footer
        </div>
      </template>
    </EditorSender>

    <EditorSender variant="updown" clearable>
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

      <!-- Custom Footer Slot -->
      <template #footer>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
          "
        >
          Updown Variant Custom Footer
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
