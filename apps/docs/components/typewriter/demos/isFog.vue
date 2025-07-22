<docs>
---
title: 支持雾化效果
---

通过 `isFog` 属性控制是否启用雾化效果。注意，该属性在 `isTyping` 为 `true` 时才生效。且会覆盖默认的 `typing` 后缀属性。
</docs>

<script setup lang="ts">
const content = ref(`#### 标题 \n 这是一个 Markdown 示例。\n - 列表项 1 \n - 列表项 2 **粗体文本** 和 *斜体文本* \n \`\`\`javascript \n console.log('Hello, world!'); \n \`\`\``);

function setContent(type: number) {
  content.value = '';
  setTimeout(() => {
    content.value = type === 1 ? `#### 标题 \n 这是一个 Markdown 示例。\n - 列表项 1 \n - 列表项 2 **粗体文本** 和 *斜体文本* \n \`\`\`javascript \n console.log('Hello, world!'); \n \`\`\`` : '欢迎使用 Element-Plus-X 💖'.repeat(10);
  }, 800);
}
</script>

<template>
  <ClientOnly>
    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; gap: 10px;">
        <el-button @click="setContent(1)">
          雾化 Markdown
        </el-button>
        <el-button @click="setContent(2)">
          雾化 文本
        </el-button>
      </div>

      <Typewriter :content="content" :is-markdown="true" is-fog typing />
    </div>
  </ClientOnly>
</template>
