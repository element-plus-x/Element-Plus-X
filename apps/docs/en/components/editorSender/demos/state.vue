<docs>
---
title: Component States
---

You can implement component states through simple properties.

::: info
- Through the `loading` property, you can control the loading state of the built-in button in the input box.
- Through the `disabled` property, you can control whether the built-in button of the input box is disabled.
- Through the `clearable` property, you can control whether the input box shows a delete button to clear the content.
:::
</docs>

<script setup lang="ts">
import type { SubmitResult } from 'vue-element-plus-x/types/EditorSender';

function handleSubmit(value: SubmitResult) {
  console.log(value);
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <EditorSender loading placeholder="Loading..." @submit="handleSubmit" />
    <EditorSender placeholder="Disabled" disabled @submit="handleSubmit" />
    <EditorSender clearable @submit="handleSubmit" />
  </div>
</template>
