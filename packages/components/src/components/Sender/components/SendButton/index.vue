<!-- SendButton 发送按钮 -->
<script setup lang="ts">
import { Top } from '@element-plus/icons-vue'

const emits = defineEmits(['submit'])
</script>

<template>
  <div class="el-send-button">
    <el-button circle @click="emits('submit')">
      <el-icon><Top /></el-icon>
    </el-button>
  </div>
</template>

<style scoped lang="scss"></style>
