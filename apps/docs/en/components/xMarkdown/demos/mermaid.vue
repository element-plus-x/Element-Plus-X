<docs>
---
title: Mermaid Diagrams
---

Enable `enable-mermaid` to render flowcharts, sequence diagrams, and more. Install `mermaid` first.
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
    A[Start] --> B{Logged in?}
    B -->|Yes| C[Home Page]
    B -->|No| D[Login Page]
    D --> E[Enter Credentials]
    E --> F{Valid?}
    F -->|Yes| C
    F -->|No| G[Show Error]
    G --> D
\`\`\`

\`\`\`mermaid
sequenceDiagram
    User->>Frontend: Click Send
    Frontend->>Server: POST /api/chat
    Server-->>Frontend: Streaming Response (SSE)
    Frontend-->>User: Real-time Markdown Render
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
  <div v-else style="padding: 16px; color: #999">Loading...</div>
</template>
