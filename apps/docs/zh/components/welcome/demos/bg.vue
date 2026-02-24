<docs>
---
title: direction 属性
---

设置 布局方法 `ltr` 从左到右 和 `rtl` 从右到左，更多属性，控制样式，详情可查看 属性 列表。
</docs>

<script setup lang="ts">
import type { WelcomeProps } from 'vue-element-plus-x/types/Welcome';
import { Refresh } from '@element-plus/icons-vue';

const bgColor = ref(
  'linear-gradient(97deg, rgba(90,196,255,0.12) 0%, rgba(174,136,255,0.12) 100%)'
);
const value = ref<WelcomeProps['direction']>('ltr');

// 生成随机的渐变颜色
function generateGradientColor(): string {
  const randomBrightColor = () => {
    // 为了保证颜色是亮色调，将取值范围设置为 128 - 255
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
        设置你喜欢的背景颜色 <el-icon><Refresh /></el-icon>
      </el-button>

      <span>切换布局：</span>
      <el-switch v-model="value" active-value="ltr" inactive-value="rtl" />
    </div>

    <Welcome
      :direction="value"
      title="欢迎来到 Element Plus X 🦋"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      title="欢迎使用 Element Plus X 💖"
      description="这是描述信息 ~"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      icon="/logo.png"
      title="欢迎使用 Element Plus X 💖"
      description="这是描述信息 ~"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      icon="/logo.png"
      title="欢迎使用 Element Plus X 💖"
      extra="副标题"
      description="这是描述信息 ~"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      variant="borderless"
      title="欢迎来到 Element Plus X 🦋"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      variant="borderless"
      title="欢迎使用 Element Plus X 💖"
      description="这是描述信息 ~"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      icon="/logo.png"
      variant="borderless"
      title="欢迎使用 Element Plus X 💖"
      description="这是描述信息 ~"
      :style="{ background: bgColor }"
    />

    <Welcome
      :direction="value"
      icon="/logo.png"
      variant="borderless"
      title="欢迎使用 Element Plus X 💖"
      extra="副标题"
      description="这是描述信息 ~"
      :style="{ background: bgColor }"
    />
  </div>
</template>

<style scoped lang="less"></style>
