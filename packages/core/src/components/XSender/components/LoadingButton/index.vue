<!-- LoadingButton loading 按钮 -->
<script setup lang="ts">
import { useNamespace } from '../../../../hooks/useNamespace';
import loading from './loading.vue';

const emits = defineEmits(['cancel']);
const ns = useNamespace('x-sender');
</script>

<template>
  <div :class="ns.e('loading-button')">
    <el-button circle @click="emits('cancel')">
      <loading :class="ns.e('loading-svg')" />
    </el-button>
  </div>
</template>

<style scoped lang="scss">
.elx-x-sender__loading-button {
  :deep(.el-button) {
    padding: 0;
  }
  .elx-x-sender__loading-svg {
    color: var(--el-color-primary);
    width: 100%;
  }
}
</style>
