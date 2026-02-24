<docs>
---
title: 自定义主题
---

通过 `ConfigProvider.themeOverrides` 覆盖 `FilesCard` 的 `--elx-*` 变量（背景、边框、删除按钮等）。
</docs>

<script setup lang="ts">
import { computed, ref } from 'vue';

const enabled = ref(true);

const themeOverrides = computed(() => {
  if (!enabled.value) return {};
  return {
    common: {
      'color-primary': '#10b981',
      'border-color': 'rgba(16, 185, 129, 0.38)',
      'text-color-regular': 'rgba(15, 23, 42, 0.82)',
      'box-shadow': '0 18px 54px rgba(16, 185, 129, 0.22)'
    },
    components: {
      FilesCard: {
        'files-card-bg':
          'linear-gradient(135deg, rgba(16, 185, 129, 0.14), rgba(20, 184, 166, 0.10))',
        'files-card-border-color': 'rgba(16, 185, 129, 0.32)',
        'files-card-progress-bg': 'rgba(16, 185, 129, 0.18)',
        'files-card-delete-bg':
          'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(20, 184, 166, 0.14))',
        'files-card-delete-border-color': 'rgba(16, 185, 129, 0.55)',
        'files-card-delete-color': '#10b981',
        'files-card-delete-shadow': '0 14px 38px rgba(16, 185, 129, 0.30)',
        'files-card-max-width': '320px'
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
      <div>点击右上角删除按钮，观察覆盖后的样式。</div>
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
              1000px 240px at 0% 0%,
              rgba(16, 185, 129, 0.2),
              transparent 60%
            ),
            radial-gradient(
              800px 220px at 100% 15%,
              rgba(20, 184, 166, 0.14),
              transparent 55%
            ),
            rgba(0, 0, 0, 0.02);
          box-shadow: var(--elx-box-shadow);
        "
      >
        <div style="display: flex; flex-direction: column; gap: 12px">
          <FilesCard
            uid="a"
            name="release-notes.pdf"
            :file-size="1024 * 1024 * 2"
            description="上传完成"
            status="done"
            :show-del-icon="true"
          />
          <FilesCard
            uid="b"
            name="model.bin"
            :file-size="1024 * 1024 * 8"
            description="上传中"
            status="uploading"
            :percent="62"
            :show-del-icon="true"
          />
        </div>
      </div>
    </ConfigProvider>
  </div>
</template>
