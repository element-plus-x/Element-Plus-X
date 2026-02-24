<docs>
---
title: extra Slot
---

Convenient to define custom subtitle content
</docs>

<script setup lang="ts">
const bgColor =
  'linear-gradient(97deg, rgba(90,196,255,0.12) 0%, rgba(174,136,255,0.12) 100%)';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <Welcome
      direction="rtl"
      icon="/logo.png"
      variant="borderless"
      :style="{ background: bgColor }"
      title="Welcome to Element Plus X 💖"
      description="A Vue 3 recreation of ant-design-x. Later will integrate AI workflow orchestration components and multi-functional md rendering components, providing the Vue development community with a useful AI component library"
    >
      <template #extra>
        <el-button link type="primary"> About Me </el-button>
      </template>
    </Welcome>
  </div>
</template>

<style scoped lang="less"></style>
