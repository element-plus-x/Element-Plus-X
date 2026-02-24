<docs>
---
title: 自定义主题
---

通过 `ConfigProvider.themeOverrides` 覆盖 `BubbleList` 的 `--elx-*` 变量，并联动 `Bubble` 的主题变量，开关前后会有明显反差。
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue';

const enabled = ref(true);

const list = ref(
  Array.from({ length: 18 }).map((_, i) => ({
    content: `第 ${i + 1} 条消息：用于演示 BubbleList 的滚动与返回按钮。`,
    placement: i % 2 === 0 ? 'start' : 'end'
  }))
);

const themeOverrides = computed(() => {
  if (!enabled.value) return {};
  return {
    common: {
      'color-primary': '#f97316',
      'border-color': 'rgba(249, 115, 22, 0.38)',
      'fill-color': 'rgba(249, 115, 22, 0.10)',
      'box-shadow': '0 18px 54px rgba(249, 115, 22, 0.22)'
    },
    components: {
      BubbleList: {
        'bubble-list-max-height': '260px',
        'bubble-list-btn-size': '38px'
      },
      Bubble: {
        'bubble-content-max-width': '420px',
        'bubble-bg':
          'linear-gradient(135deg, rgba(249, 115, 22, 0.16), rgba(245, 158, 11, 0.10))',
        'bubble-border-color': 'rgba(249, 115, 22, 0.30)',
        'bubble-text-color': 'rgba(15, 23, 42, 0.86)',
        'bubble-radius': '18px',
        'bubble-padding-y': '14px',
        'bubble-padding-x': '18px',
        'bubble-shadow': '0 18px 52px rgba(249, 115, 22, 0.18)',
        'bubble-dot-color': '#f97316'
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
      <div>滚动列表，观察最大高度与返回按钮尺寸变化。</div>
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
              rgba(249, 115, 22, 0.22),
              transparent 60%
            ),
            radial-gradient(
              900px 240px at 100% 20%,
              rgba(245, 158, 11, 0.14),
              transparent 55%
            ),
            rgba(0, 0, 0, 0.02);
          box-shadow: var(--elx-box-shadow);
        "
      >
        <BubbleList :list="list" />
      </div>
    </ConfigProvider>
  </div>
</template>
