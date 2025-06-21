<script setup lang="ts">
const content = ref('')

const defaultText = `
# 标题
这是一个 Markdown 示例。
- 列表项 1
- 列表项 2
**粗体文本** 和 *斜体文本*
\`\`\`javascript
console.log('Hello, world!');
\`\`\`

\`\`\`java
console.log('Hello, world!');
\`\`\`

\`\`\`mermaid
pie
    "传媒及文化相关" : 35
    "广告与市场营销" : 8
    "游戏开发" : 15
    "影视动画与特效" : 12
    "互联网产品设计" : 10
    "VR/AR开发" : 5
    "其他" : 15
\`\`\`

\`\`\`mermaid
sequenceDiagram
    autonumber
    participant 1 as $$alpha$$
    participant 2 as $$beta$$
    1->>2: Solve: $$\sqrt{2+2}$$
    2-->>1: Answer: $$2$$
    Note right of 2: $$\sqrt{2+2}=\sqrt{4}=2$$
\`\`\`
`
onMounted(() => {
  let index = 0
  const timer = setInterval(() => {
    if (index >= defaultText.length) {
      clearInterval(timer)
      return
    }
    content.value = defaultText.slice(0, index)
    index++
  }, 50)
})
</script>

<template>
  <div class="md-container">
    <Markdown :markdown="content"></Markdown>
  </div>
</template>
<style>
.md-container {
  max-height: 500px;
  overflow: auto;
}
</style>