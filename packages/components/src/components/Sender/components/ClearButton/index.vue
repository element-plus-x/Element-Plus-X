<!-- ClearButton 清理按钮 -->
<script setup lang="ts">
import { Brush } from '@element-plus/icons-vue'
import { defineEmits } from 'vue'

const emit = defineEmits(['clear'])
</script>

<template>
  <div class="el-send-button">
    <el-button circle @click="emit('clear')">
      <el-icon><Brush /></el-icon>
    </el-button>
  </div>
</template>

<style scoped lang="scss">
.el-send-button {
  :deep() {
    .el-button {
      .el-icon {
        // 旋转180
        transform: rotate(180deg);
      }
    }
  }
}
</style>
