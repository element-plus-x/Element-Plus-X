<docs>
---
title: 自定义主题
---

通过 `ConfigProvider.themeOverrides` 覆盖 `Conversations` 的 `--elx-*` 变量（列表背景、标签高度等）。
</docs>

<script setup lang="ts">
import type { ConversationItem } from 'vue-element-plus-x/types/Conversations';
import { computed, ref } from 'vue';

const enabled = ref(true);

const themeOverrides = computed(() => {
  if (!enabled.value) return {};
  return {
    common: {
      'color-primary': '#ec4899',
      'border-color': 'rgba(236, 72, 153, 0.38)',
      'fill-color': 'rgba(236, 72, 153, 0.10)',
      'fill-color-light': 'rgba(236, 72, 153, 0.06)',
      'text-color-primary': 'rgba(15, 23, 42, 0.92)',
      'text-color-regular': 'rgba(15, 23, 42, 0.80)',
      'box-shadow': '0 18px 54px rgba(236, 72, 153, 0.20)'
    },
    components: {
      Conversations: {
        'conversations-list-auto-bg-color': 'rgba(236, 72, 153, 0.06)',
        'conversations-label-height': '32px'
      }
    }
  };
});

const items = ref<ConversationItem<{ id: string; label: string }>[]>([
  { id: '1', label: '新对话', group: 'today' },
  { id: '2', label: '需求讨论', group: 'today' },
  { id: '3', label: '异常排查', group: 'yesterday' },
  { id: '4', label: '版本回归', group: 'last-week' }
]);

const active = ref<string>('2');
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px">
    <div
      style="display: flex; align-items: center; justify-content: space-between"
    >
      <div>开启覆写后，可看到列表背景与条目高度变化。</div>
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
              1200px 260px at 0% 0%,
              rgba(236, 72, 153, 0.2),
              transparent 60%
            ),
            radial-gradient(
              900px 240px at 100% 20%,
              rgba(168, 85, 247, 0.14),
              transparent 55%
            ),
            rgba(0, 0, 0, 0.02);
          box-shadow: var(--elx-box-shadow);
        "
      >
        <Conversations
          v-model:active="active"
          :items="items"
          row-key="id"
          :items-style="{
            borderRadius: '12px',
            margin: '6px 10px',
            padding: '10px 12px',
            background: 'var(--elx-fill-color-light)',
            border: '1px solid var(--elx-border-color)'
          }"
          :items-hover-style="{
            background: 'var(--elx-fill-color)'
          }"
          :items-active-style="{
            background: 'rgba(236, 72, 153, 0.14)',
            border: '1px solid rgba(236, 72, 153, 0.40)'
          }"
          style="width: 340px; height: 300px"
        />
      </div>
    </ConfigProvider>
  </div>
</template>
