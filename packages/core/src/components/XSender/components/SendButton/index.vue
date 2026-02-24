<!-- SendButton 发送按钮 -->
<script setup lang="ts">
import { Top } from '@element-plus/icons-vue';
import { useNamespace } from '../../../../hooks/useNamespace';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
});

const emits = defineEmits(['submit']);
const ns = useNamespace('x-sender');
</script>

<template>
  <div :class="ns.e('send-button')">
    <el-button circle :disabled="props.disabled" @click="emits('submit')">
      <el-icon><Top /></el-icon>
    </el-button>
  </div>
</template>

<style scoped lang="scss"></style>
