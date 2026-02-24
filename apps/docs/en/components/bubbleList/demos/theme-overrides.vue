<docs>
---
title: Theme Overrides (themeOverrides)
---

Override `BubbleList` `--elx-*` variables via `ConfigProvider.themeOverrides` and also style `Bubble` for a stronger contrast.
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue';

const enabled = ref(true);

const list = ref(
  Array.from({ length: 18 }).map((_, i) => ({
    content: `Message ${i + 1}: used to demonstrate scrolling and the back button.`,
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
      <div>Scroll the list to see size changes.</div>
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
        {{ enabled ? 'Disable theme overrides' : 'Enable theme overrides' }}
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
