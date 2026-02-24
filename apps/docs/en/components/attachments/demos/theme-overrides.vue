<docs>
---
title: Theme Overrides (themeOverrides)
---

Use `ConfigProvider.themeOverrides` to override `Attachments` `--elx-*` variables (and also `FilesCard`) for a stronger before/after contrast.
</docs>

<script setup lang="ts">
import type { FilesCardProps } from 'vue-element-plus-x/types/FilesCard';
import { computed, ref } from 'vue';

const enabled = ref(true);

const files = ref<FilesCardProps[]>([
  {
    uid: '1',
    name: 'design-spec.pdf',
    fileSize: 1024 * 1024 * 2,
    showDelIcon: true
  },
  {
    uid: '2',
    name: 'avatar.png',
    fileSize: 1024 * 340,
    showDelIcon: true,
    imgVariant: 'square'
  },
  {
    uid: '3',
    name: 'demo.zip',
    fileSize: 1024 * 1024 * 5,
    showDelIcon: true
  },
  {
    uid: '4',
    name: 'readme.md',
    fileSize: 1024 * 8,
    showDelIcon: true
  },
  {
    uid: '5',
    name: 'report.xlsx',
    fileSize: 1024 * 420,
    showDelIcon: true
  }
]);

const themeOverrides = computed(() => {
  if (!enabled.value) return {};
  return {
    common: {
      'color-primary': '#7c3aed',
      'bg-surface': 'rgba(124, 58, 237, 0.06)',
      'border-color': 'rgba(124, 58, 237, 0.28)',
      'fill-color': 'rgba(124, 58, 237, 0.08)',
      'text-color-primary': 'rgba(15, 23, 42, 0.92)',
      'text-color-regular': 'rgba(15, 23, 42, 0.78)',
      'box-shadow': '0 16px 48px rgba(124, 58, 237, 0.22)'
    },
    components: {
      Attachments: {
        'attachments-nav-bg': 'rgba(124, 58, 237, 0.55)',
        'attachments-nav-bg-hover': 'rgba(124, 58, 237, 0.75)',
        'attachments-nav-bg-active': 'rgba(124, 58, 237, 0.92)',
        'attachments-nav-color': '#ffffff',
        'attachments-drop-bg':
          'linear-gradient(135deg, rgba(124, 58, 237, 0.14), rgba(59, 130, 246, 0.10))',
        'attachments-upload-icon-color': '#7c3aed',
        'attachments-upload-icon-size': '60px'
      },
      FilesCard: {
        'files-card-bg':
          'linear-gradient(135deg, rgba(124, 58, 237, 0.14), rgba(59, 130, 246, 0.08))',
        'files-card-border-color': 'rgba(124, 58, 237, 0.28)',
        'files-card-progress-bg': 'rgba(124, 58, 237, 0.16)',
        'files-card-delete-bg': 'rgba(124, 58, 237, 0.14)',
        'files-card-delete-border-color': 'rgba(124, 58, 237, 0.35)',
        'files-card-delete-color': '#7c3aed',
        'files-card-delete-shadow': '0 10px 30px rgba(124, 58, 237, 0.25)'
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
      <div>Tip: this demo overrides Attachments tokens only.</div>
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
          background: linear-gradient(
            135deg,
            rgba(124, 58, 237, 0.1),
            rgba(59, 130, 246, 0.06)
          );
          box-shadow: var(--elx-box-shadow);
        "
      >
        <Attachments
          :items="files"
          overflow="scrollX"
          :list-style="{ height: '140px' }"
        />
      </div>
    </ConfigProvider>
  </div>
</template>
