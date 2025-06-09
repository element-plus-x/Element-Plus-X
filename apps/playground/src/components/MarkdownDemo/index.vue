<script setup lang="ts">
import Markdown from 'vue-element-plus-x/src/components/Markdown/index.vue'
// @ts-ignore
import Table from './table.vue'
const content = ref('')

const tableData = [
  {
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    address: 'Lohrbergstr. 86c, Süd Lilli, Saarland',
  },
  {
    date: '2016-05-03',
    name: 'Helen Jacobi',
    address: '760 A Street, South Frankfield, Illinois',
  },
  {
    date: '2016-05-02',
    name: 'Brandon Deckert',
    address: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen',
  },
  {
    date: '2016-05-01',
    name: 'Margie Smith',
    address: '23618 Windsor Drive, West Ricardoview, Idaho',
  },
]

const defaultText = `
# 标题
\`\`\`el-table
${JSON.stringify(tableData)}
\`\`\`
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
  <div class="component-container">
    <el-alert type="warning"> beta 版本，探索中... </el-alert>
    <div class="component-1">
      <Markdown :markdown="content" :codeBlockRenderers="{
        'el-table': Table,
      }" class="markdown-body">
      </Markdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;
  height: calc(100vh - 220px);
  overflow: auto;

  .component-1 {
    display: flex;

    .footer-container {
      :deep() {
        .el-button+.el-button {
          margin-left: 8px;
        }
      }
    }
  }
}
</style>
