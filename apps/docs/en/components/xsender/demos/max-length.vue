<docs>
---
title: 输入长度限制
---

可以通过 `maxLength` 来限制输入框的最大输入长度。

::: danger

该配置项性能开销较大 非必要情况请别设置（像豆包和文心一言都不对这块做限制不应因小失大）

:::
</docs>

<script setup lang="ts">
import type { XSender } from 'vue-element-plus-x';
import { ref } from 'vue';

const senderRef = ref<InstanceType<typeof XSender>>();

const maxLength = ref(200);
</script>

<template>
  <div style="margin-bottom: 20px">
    <span
      >当前输入长度：{{ senderRef?.senderState.textLength }} /
      {{ maxLength }}</span
    >
  </div>
  <XSender ref="senderRef" :max-length="maxLength" placeholder="输入长度限制" />
</template>
