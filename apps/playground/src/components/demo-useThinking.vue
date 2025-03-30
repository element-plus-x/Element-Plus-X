<script lang='ts' setup>
import type { ThinkingItem } from 'vue-element-plus-x/types/components/Thinking/types'
import { Check } from '@element-plus/icons-vue'

const thinkings = ref<ThinkingItem[]>([{
  id: '1',
  content: '收到问题',
  title: '进行搜索文字',
  type: 'success',
  dotIcon: markRaw(Check),
  isCanExpand: true,
  isDefaultExpand: false,
  expandContent: '进行搜索文字',
}])

const thinkingItems = ref<ThinkingItem[]>([
  {
    id: '1',
    content: '收到问题',
    title: '进行搜索文字',
    type: 'success',
    dotIcon: markRaw(Check),
    isCanExpand: true,
    isDefaultExpand: true,
    expandContent: '进行搜索文字',
  },
  {
    id: '2',
    content: '找到问题',
    title: '思考中',
    type: 'primary',
    dotIcon: markRaw(Check),
    isLoading: true,
  },
])

setTimeout(() => {
  thinkingItems.value[1] = {
    ...thinkingItems.value[1],
    isLoading: false,
    type: 'success',
  }
  thinkingItems.value.push({
    id: '3',
    content: '解决问题',
    title: '进行搜索文字',
    hideTitle: true,
    type: 'primary',
    dotIcon: Check,
    isLoading: true,
    isCanExpand: true,
    isDefaultExpand: true,
    expandContent: '进行搜索文字',
  })
}, 4000)
</script>

<template>
  <div class="component-container">
    <Thinking :thinking-items="thinkings" /> <br>
    <Thinking :thinking-items="thinkingItems" @handle-expand="(id:string[]) => console.log(id)" />
  </div>
</template>

<style lang='scss' scoped>
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;
}
</style>
