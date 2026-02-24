<docs>
---
title: Basic Usage
---

Quickly create a welcome card
</docs>

<script setup lang="ts"></script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <Welcome title="Welcome to Element Plus X 🦋" />

    <Welcome
      title="Welcome to Element Plus X 💖"
      description="This is description information ~"
    />

    <Welcome
      icon="/logo.png"
      title="Welcome to Element Plus X 💖"
      description="This is description information ~"
    />

    <Welcome
      icon="/logo.png"
      title="Welcome to Element Plus X 💖"
      extra="Subtitle"
      description="This is description information ~"
    />
  </div>
</template>

<style scoped lang="less"></style>
