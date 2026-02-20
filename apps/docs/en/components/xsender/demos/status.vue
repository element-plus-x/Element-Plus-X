<docs>
---
title: 组件状态
---

可以通过简单属性是，实现组件的状态

::: info
- 通过 `loading` 属性，可以控制输入框是否加载中。
- 通过 `disabled` 属性，可以控制输入框是否禁用。
- 通过 `clearable` 属性，可以控制输入框是否出现删除按钮，实现清空。
:::
</docs>

<script setup lang="ts"></script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <XSender loading placeholder="加载中..." />
    <XSender disabled placeholder="禁用" />
    <XSender clearable placeholder="删除按钮" />
  </div>
</template>
