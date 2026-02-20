<docs>
---
title: 提及用户
---

默认可以通过 `@` 触发提及用户选择弹窗。
可以通过 `setMention` 插入一个提及用户标签。
使用 `setChatNode` 可以高度预设输入框的模板内容。
</docs>

<script setup lang="ts">
import type { XSender } from 'vue-element-plus-x';
import { ref } from 'vue';

const senderRef = ref<InstanceType<typeof XSender>>();

const mentionConfig = ref({
  dialogTitle: '用户选择',
  callEvery: false,
  options: [
    {
      name: '用户1',
      id: 'user1'
    },
    {
      name: '用户2',
      id: 'user2'
    },
    {
      name: '用户3',
      id: 'user3'
    }
  ]
});

function onSetBasic() {
  senderRef.value?.setMention('user1');
}

function onSetModel() {
  senderRef.value?.setChatNode([
    [
      {
        type: 'Write',
        text: '这些工作任务将由'
      },
      {
        type: 'Mention',
        id: 'user1',
        name: '用户1'
      },
      {
        type: 'Write',
        text: '负责完成。'
      }
    ]
  ]);
}
</script>

<template>
  <div>
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="onSetBasic"> API插入 </el-button>
      <el-button type="primary" @click="onSetModel">
        预设模版内容插入
      </el-button>
    </div>
    <XSender
      ref="senderRef"
      variant="updown"
      :mention-config="mentionConfig"
      placeholder="敲击 @键 唤起提及用户选择"
    />
  </div>
</template>
