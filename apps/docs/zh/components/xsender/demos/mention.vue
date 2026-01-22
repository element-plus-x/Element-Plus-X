<script setup lang="ts">
import type { XSender } from 'vue-element-plus-x';
import { ref } from 'vue';

const senderRef = ref<InstanceType<typeof XSender>>();

const mentionConfig = ref({
  dialogTitle: '用户选择',
  options: [
    {
      name: '用户1',
      id: 'user1',
    },
    {
      name: '用户2',
      id: 'user2',
    },
    {
      name: '用户3',
      id: 'user3',
    },
  ]
});
</script>

<template>
  <div>
    <XSender
      ref="senderRef"
      variant="updown"
      :mention-config="mentionConfig"
      placeholder="敲击 @键 唤起提及用户选择"
    ></XSender>
  </div>
</template>
