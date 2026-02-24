<docs>
---
title: 自定义主题
---

通过 `ConfigProvider.themeOverrides` 覆写 `Welcome` 的 `--elx-*` 变量，实时观察样式变化。
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue';

const enabled = ref(true);

const themeOverrides = computed(() => {
  if (!enabled.value) return {};
  return {
    common: {
      'color-primary': '#7c3aed',
      'border-color': 'rgba(124, 58, 237, 0.32)',
      'box-shadow': '0 18px 54px rgba(124, 58, 237, 0.22)'
    },
    components: {
      Welcome: {
        'welcome-filled-bg': 'rgba(255, 255, 255, 0.9)',
        'welcome-filled-border': 'rgba(124, 58, 237, 0.45)',
        'welcome-title-color': 'rgba(15, 23, 42, 0.92)',
        'welcome-description-color': 'rgba(15, 23, 42, 0.72)',
        'welcome-border-radius': '16px',
        'welcome-padding': '28px',
        'welcome-gap': '18px',
        'welcome-icon-size': '72px'
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
      <div>点击右侧按钮切换覆写效果。</div>
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
          border-radius: 18px;
          border: 1px solid var(--elx-border-color);
          background:
            radial-gradient(
              1200px 260px at 0% 0%,
              rgba(124, 58, 237, 0.2),
              transparent 60%
            ),
            radial-gradient(
              900px 240px at 100% 20%,
              rgba(59, 130, 246, 0.14),
              transparent 55%
            ),
            rgba(0, 0, 0, 0.02);
          box-shadow: var(--elx-box-shadow);
        "
      >
        <Welcome
          title="欢迎使用 Element Plus X"
          description="开关前后会看到整体间距、圆角、边框与“卡片质感”变化。"
          variant="filled"
        />
      </div>
    </ConfigProvider>
  </div>
</template>
