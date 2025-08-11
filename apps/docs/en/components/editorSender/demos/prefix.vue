<docs>
---
title: Prefix Slot
---

Use the `#prefix` slot to customize the prefix content of the input box.
</docs>

<script setup lang="ts">
import { Link } from '@element-plus/icons-vue';

const senderRef = ref();
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      gap: 12px;
      justify-content: flex-end;
    "
  >
    <EditorSender ref="senderRef">
      <!-- Custom Prefix -->
      <template #prefix>
        <div class="prefix-self-wrap">
          <el-button dark>
            <el-icon><Link /></el-icon>
            <span>Custom Prefix</span>
          </el-button>
        </div>
      </template>
    </EditorSender>
  </div>
</template>

<style scoped lang="less">
.header-self-wrap {
  display: flex;
  flex-direction: column;
  padding: 16px;
  height: 200px;
  .header-self-title {
    width: 100%;
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 8px;
  }
  .header-self-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #626aef;
    font-weight: 600;
  }
}

.prefix-self-wrap {
  display: flex;
}
</style>
