<docs>
---
title: 自定义主题
---

通过 `ConfigProvider.themeOverrides` 覆盖 `Thinking` 的 `--elx-*` 变量（按钮背景、边框、内容区域等）。
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue';

const enabled = ref(true);

const themeOverrides = computed(() => {
  if (!enabled.value) return {};
  return {
    common: {
      'color-primary': '#06b6d4',
      'border-color': 'rgba(6, 182, 212, 0.35)',
      'text-color-regular': 'rgba(15, 23, 42, 0.82)',
      'box-shadow': '0 18px 54px rgba(6, 182, 212, 0.22)'
    },
    components: {
      Thinking: {
        'thinking-trigger-bg': 'rgba(6, 182, 212, 0.10)',
        'thinking-trigger-bg-hover': 'rgba(6, 182, 212, 0.16)',
        'thinking-trigger-border-color': 'rgba(6, 182, 212, 0.45)',
        'thinking-content-wrapper-background-color':
          'linear-gradient(135deg, rgba(6, 182, 212, 0.10), rgba(99, 102, 241, 0.08))',
        'thinking-content-wrapper-color': 'rgba(15, 23, 42, 0.86)',
        'thinking-content-wrapper-width': '560px',
        'thinking-button-width': '190px'
      }
    }
  };
});
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div>点击按钮展开/收起内容，观察主题覆写效果。</div>
      <button
        type="button"
        style="
          padding: 6px 10px;
          border-radius: 8px;
          border: 1px solid rgba(0, 0, 0, 0.12);
          background: rgba(0, 0, 0, 0.02);
          cursor: pointer;
        "
        @click="enabled = !enabled"
      >
        {{ enabled ? '关闭自定义主题' : '开启自定义主题' }}
      </button>
    </div>

    <ConfigProvider apply-to="self" :theme-overrides="themeOverrides">
      <div
        style="
          padding: 14px;
          border-radius: 16px;
          border: 1px solid var(--elx-border-color);
          background:
            radial-gradient(
              1200px 300px at 0% 0%,
              rgba(6, 182, 212, 0.2),
              transparent 60%
            ),
            radial-gradient(
              900px 240px at 100% 10%,
              rgba(99, 102, 241, 0.14),
              transparent 55%
            ),
            rgba(0, 0, 0, 0.02);
          box-shadow: var(--elx-box-shadow);
        "
      >
        <Thinking
          status="thinking"
          content="这里是 Thinking 的示例内容。\n开关前后会看到按钮与内容区域的“玻璃感”变化。"
          :auto-collapse="false"
        />
      </div>
    </ConfigProvider>
  </div>
</template>
