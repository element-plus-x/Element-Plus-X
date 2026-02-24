<!-- ClearButton 清理按钮 -->
<script setup lang="ts">
import { Brush } from '@element-plus/icons-vue';
import { defineEmits } from 'vue';
import { useNamespace } from '../../../../hooks/useNamespace';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['clear']);
const ns = useNamespace('x-sender');
</script>

<template>
  <div :class="ns.e('clear-button')">
    <el-button circle :disabled="props.disabled" @click="emit('clear')">
      <el-icon><Brush /></el-icon>
    </el-button>
  </div>
</template>

<style scoped lang="scss">
.elx-x-sender__clear-button {
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
