<docs>
---
title: variant 属性
---

快速切换多种样式，目前只有两种，`filled` 和 `borderless`。默认为 `filled`。
</docs>

<script setup lang="ts"></script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <Welcome title="欢迎来到 Element Plus X 🦋" />

    <Welcome title="欢迎使用 Element Plus X 💖" description="这是描述信息 ~" />

    <Welcome
      icon="/logo.png"
      title="欢迎使用 Element Plus X 💖"
      description="这是描述信息 ~"
    />

    <Welcome
      icon="/logo.png"
      variant="borderless"
      title="欢迎使用 Element Plus X 💖"
      extra="副标题"
      description="这是描述信息 ~"
    />
  </div>
</template>

<style scoped lang="less"></style>
