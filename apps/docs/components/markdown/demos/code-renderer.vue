<script setup lang="ts">
import { h } from 'vue'
import { ElTag } from 'element-plus'
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
##### 使用codeBlockRenderers渲染element-plus组件
\`\`\`el-tag
这是第一个标签
\`\`\`
\`\`\`el-tag
这是第二个标签
\`\`\`
\`\`\`el-tag
这是第三个标签
\`\`\`
\`\`\`el-table
${JSON.stringify(tableData)}
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
  }, 100)
})
</script>

<template>
  <Markdown :markdown="content" :codeBlockRenderers="{
    'el-table': Table,
    'el-tag': (props: any) => {
      return h(ElTag, { type: 'warning' }, props.content)
    }
  }">
  </Markdown>
</template>