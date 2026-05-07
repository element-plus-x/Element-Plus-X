<docs>
---
title: 自定义 Mermaid 操作按钮
---

通过 `mermaid-actions` 传入自定义按钮数组，可在 Mermaid 图表工具栏添加自定义操作。
</docs>

<script setup lang="ts">
import 'shiki';
import 'shiki-stream';

const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value = mod.MarkdownRenderer ?? mod.default ?? mod;
});

const content = `\`\`\`mermaid
graph LR
    A[客户端] --> B[负载均衡]
    B --> C[服务A]
    B --> D[服务B]
    C --> E[(数据库)]
    D --> E
\`\`\`
`;

const lastAction = ref('');

const mermaidActions = [
  {
    key: 'share',
    title: '分享图表',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>`,
    onClick: (props: any) => {
      lastAction.value = `分享图表，SVG 长度：${props.svg.length} 字符`;
    }
  },
  {
    key: 'edit-online',
    title: '在线编辑',
    icon: `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
    show: (props: any) => !props.showSourceCode,
    onClick: (props: any) => {
      lastAction.value = `打开编辑器，原始内容：${props.rawContent.substring(0, 40)}...`;
    }
  }
];
</script>

<template>
  <div>
    <div
      v-if="lastAction"
      style="
        margin-bottom: 8px;
        padding: 8px 12px;
        background: #f0f9ff;
        border-radius: 4px;
        color: #0369a1;
        font-size: 13px;
      "
    >
      操作记录：{{ lastAction }}
    </div>
    <component
      :is="MarkdownRenderer"
      v-if="MarkdownRenderer"
      :markdown="content"
      :mermaid-actions="mermaidActions"
    />
    <div v-else style="padding: 16px; color: #999">加载中...</div>
  </div>
</template>
