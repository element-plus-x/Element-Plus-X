<docs>
---
title: 渲染 markdown 文本内容
---

通过设置 `isMarkdown` 属性，开启 `markdown` 文本内容渲染模式。 更新 `content` 如果是之前的子集，则会继续输出，否则会重新输出。
</docs>

<script setup lang="ts">
const avatarUser = 'https://avatars.githubusercontent.com/u/76239030?v=4'
const content = ref(`## 🔥Element-Plus-X \n 🥰 感谢使用 Element-Plus-X! \n - 列表项 1 \n - 列表项 2 **粗体文本** 和 *斜体文本* \n \`\`\`javascript \n console.log('Hello, world!'); \n \`\`\` \n`)
const num = ref(1)

function changeContent() {
  num.value++
  content.value = content.value.repeat(num.value)
  if (num.value > 2) {
    num.value = 1
    content.value = `## 🔥Element-Plus-X \n 🥰 感谢使用 Element-Plus-X! \n - 列表项 1 \n - 列表项 2 **粗体文本** 和 *斜体文本* \n \`\`\`javascript \n console.log('Hello, world!'); \n \`\`\` \n`
  }
}
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 12px;">
    <el-button style="width: fit-content;" @click="changeContent">
      设置 markdown
    </el-button>
    <Bubble :content="content" typing isMarkdown>
      <template #avatar>
        <el-avatar :size="32" :src="avatarUser" />
      </template>
    </Bubble>
  </div>
</template>

<style scoped lang="less">
:deep(.markdown-body) {
  background-color: transparent;
}
</style>
