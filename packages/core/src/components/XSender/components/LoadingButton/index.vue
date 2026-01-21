<!-- LoadingButton loading 按钮 -->
<script setup lang="ts">
import loading from './loading.vue';

const emits = defineEmits(['cancel']);
</script>

<template>
  <div class="el-send-button">
    <el-button circle @click="emits('cancel')">
      <loading class="loading-svg" />
    </el-button>
  </div>
</template>

<style scoped lang="scss">
.el-send-button {
  :deep(.el-button) {
    padding: 0;
  }
  .loading-svg {
    color: var(--el-color-primary);
    width: 100%;
  }
}
</style>
