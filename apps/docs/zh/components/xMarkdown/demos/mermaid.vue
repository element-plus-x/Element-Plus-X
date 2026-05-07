<docs>
---
title: Mermaid 图表
---

开启 `enable-mermaid` 后可渲染流程图、时序图等，需安装 `mermaid`。
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
graph TD
    A[开始] --> B{已登录?}
    B -->|是| C[进入首页]
    B -->|否| D[跳转登录页]
    D --> E[输入凭据]
    E --> F{验证通过?}
    F -->|是| C
    F -->|否| G[提示错误]
    G --> D
\`\`\`

\`\`\`mermaid
sequenceDiagram
    用户->>前端: 点击发送
    前端->>服务端: POST /api/chat
    服务端-->>前端: 流式响应 (SSE)
    前端-->>用户: 实时渲染 Markdown
\`\`\`
`;
</script>

<template>
  <component
    :is="MarkdownRenderer"
    v-if="MarkdownRenderer"
    :markdown="content"
    :enable-mermaid="true"
  />
  <div v-else style="padding: 16px; color: #999">加载中...</div>
</template>
