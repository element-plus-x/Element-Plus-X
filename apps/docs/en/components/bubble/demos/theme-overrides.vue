<docs>
---
title: Theme Overrides (themeOverrides)
---

Override `Bubble` theme tokens via `ConfigProvider.themeOverrides` (background, border, radius, padding, width, etc.) for a clear before/after contrast.
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
      <div>When enabled, bubble content becomes narrower.</div>
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
          content="Start bubble: gradient background, larger radius and stronger shadow after overrides."
        />
        <Bubble
          placement="end"
          variant="shadow"
          content="End bubble: use themeOverrides to build a consistent glass-like theme."
        />
        <Bubble placement="start" variant="shadow" loading />
      </div>
    </ConfigProvider>
  </div>
</template>
