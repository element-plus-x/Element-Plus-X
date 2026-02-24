<docs>
---
title: 基础用法
---

快速创建一个 欢迎卡片
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
      title="欢迎使用 Element Plus X 💖"
      extra="副标题"
      description="这是描述信息 ~"
    />
  </div>
</template>

<style scoped lang="less"></style>
