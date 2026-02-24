<docs>
---
title: image 插槽
---

方便更换自定义的 图片
</docs>

<script setup lang="ts">
const bgColor =
  'linear-gradient(97deg, rgba(90,196,255,0.12) 0%, rgba(174,136,255,0.12) 100%)';
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <Welcome
      variant="borderless"
      :style="{ background: bgColor }"
      title="欢迎使用 Element Plus X 💖"
      description="用 vue3 对 ant-design-x 的复刻。后续将会集成 AI 工作流编排组件 和 md 多功能渲染组件，给 Vue 开发社区 一个好用的 AI 组件库"
    >
      <template #image>
        <img src="/logo.png" style="width: 80px" />
      </template>
    </Welcome>
  </div>
</template>

<style scoped lang="less"></style>
