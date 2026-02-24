<docs>
---
title: direction Property
---

Set layout method `ltr` from left to right and `rtl` from right to left, more properties to control styles, see property list for details.
</docs>

<script setup lang="ts">
import type { WelcomeProps } from 'vue-element-plus-x/types/Welcome';
import { Refresh } from '@element-plus/icons-vue';

const bgColor = ref(
  'linear-gradient(97deg, rgba(90,196,255,0.12) 0%, rgba(174,136,255,0.12) 100%)'
);
const value = ref<WelcomeProps['direction']>('ltr');

// Generate random gradient colors
function generateGradientColor(): string {
  const randomBrightColor = () => {
    // To ensure colors are bright tones, set the range to 128 - 255
    const r = Math.floor(Math.random() * 128) + 128;
    const g = Math.floor(Math.random() * 128) + 128;
    const b = Math.floor(Math.random() * 128) + 128;
    return `rgba(${r}, ${g}, ${b}, 0.2)`;
  };

  const color1 = randomBrightColor();
  const color2 = randomBrightColor();
  const color3 = randomBrightColor();

  return `linear-gradient(to bottom right, ${color1}, ${color2}, ${color3})`;
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div style="display: flex; gap: 12px; align-items: center">
      <el-button
        type="warning"
        style="width: fit-content"
        @click="bgColor = generateGradientColor()"
      >
        Set your favorite background color <el-icon><Refresh /></el-icon>
      </el-button>

      <span>Switch layout: </span>
      <el-switch v-model="value" active-value="ltr" inactive-value="rtl" />
    </div>

    <Welcome
      :direction="value"
      title="Welcome to Element Plus X 🦋"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      title="Welcome to Element Plus X 💖"
      description="This is description information ~"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      icon="/logo.png"
      title="Welcome to Element Plus X 💖"
      description="This is description information ~"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      icon="/logo.png"
      title="Welcome to Element Plus X 💖"
      extra="Subtitle"
      description="This is description information ~"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      variant="borderless"
      title="Welcome to Element Plus X 🦋"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      variant="borderless"
      title="Welcome to Element Plus X 💖"
      description="This is description information ~"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      icon="/logo.png"
      variant="borderless"
      title="Welcome to Element Plus X 💖"
      description="This is description information ~"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      icon="/logo.png"
      variant="borderless"
      title="Welcome to Element Plus X 💖"
      extra="Subtitle"
      description="This is description information ~"
      :style="{ background: bgColor }"
    />
  </div>
</template>

<style scoped lang="less"></style>
