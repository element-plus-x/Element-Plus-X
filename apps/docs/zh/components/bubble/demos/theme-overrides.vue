<docs>
---
title: 自定义主题
---

通过 `ConfigProvider.themeOverrides` 覆盖 `Bubble` 的主题变量（背景、边框、圆角、padding、宽度等），开关前后会有明显反差。
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue';

const enabled = ref(true);

const themeOverrides = computed(() => {
  if (!enabled.value) return {};
  return {
    common: {
      'color-primary': '#8b5cf6',
      'border-color': 'rgba(139, 92, 246, 0.35)',
      'fill-color': 'rgba(139, 92, 246, 0.10)',
      'text-color-primary': 'rgba(15, 23, 42, 0.92)',
      'box-shadow': '0 18px 54px rgba(139, 92, 246, 0.22)'
    },
    components: {
      Bubble: {
        'bubble-content-max-width': '420px',
        'bubble-bg':
          'linear-gradient(135deg, rgba(139, 92, 246, 0.16), rgba(59, 130, 246, 0.10))',
        'bubble-border-color': 'rgba(139, 92, 246, 0.32)',
        'bubble-text-color': 'rgba(15, 23, 42, 0.86)',
        'bubble-radius': '18px',
        'bubble-padding-y': '14px',
        'bubble-padding-x': '18px',
        'bubble-shadow': '0 18px 52px rgba(139, 92, 246, 0.18)',
        'bubble-dot-color': '#8b5cf6'
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
      <div>开启覆写后，气泡内容最大宽度会变窄。</div>
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
              1200px 280px at 0% 0%,
              rgba(139, 92, 246, 0.22),
              transparent 60%
            ),
            radial-gradient(
              900px 240px at 100% 20%,
              rgba(59, 130, 246, 0.14),
              transparent 55%
            ),
            rgba(0, 0, 0, 0.02);
          box-shadow: var(--elx-box-shadow);
          display: flex;
          flex-direction: column;
          gap: 10px;
        "
      >
        <Bubble
          placement="start"
          variant="borderless"
          content="这是一个 start 气泡。覆写后会变成渐变背景 + 大圆角 + 更强阴影。"
        />
        <Bubble
          placement="end"
          variant="shadow"
          content="这是一个 end 气泡。通过 themeOverrides 你可以把 Bubble 做成统一的“玻璃风”主题。"
        />
        <Bubble placement="start" variant="shadow" loading />
      </div>
    </ConfigProvider>
  </div>
</template>
