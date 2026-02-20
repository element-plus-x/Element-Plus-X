<docs>
---
title: 自定义指令
---

默认可以通过自定义设置触发符触发选择弹窗。
可以通过 `setTrigger` 插入一个提及用户标签。
使用 `setChatNode` 可以高度预设输入框的模板内容。
</docs>

<script setup lang="ts">
import type { XSender } from 'vue-element-plus-x';
import { ref } from 'vue';

const senderRef = ref<InstanceType<typeof XSender>>();

const triggerConfig = ref([
  {
    dialogTitle: '技能选择',
    key: '/',
    options: [
      {
        name: '技能1',
        id: 'skill1'
      },
      {
        name: '技能2',
        id: 'skill2'
      },
      {
        name: '技能3',
        id: 'skill3'
      }
    ]
  }
]);

function onSetBasic() {
  senderRef.value?.setTrigger('/', 'skill1');
}

function onSetModel() {
  senderRef.value?.setChatNode([
    [
      {
        type: 'Write',
        text: '用户选择了'
      },
      {
        type: 'Trigger',
        key: '/',
        id: 'skill3',
        name: '技能3'
      },
      {
        type: 'Write',
        text: '模式。'
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
      :trigger-config="triggerConfig"
      variant="updown"
      placeholder="敲击 / 唤起技能选择"
    />
  </div>
</template>
