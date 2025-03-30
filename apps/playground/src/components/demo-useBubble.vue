<!-- home 首页-使用 Bubble 组件 -->
<script setup lang="ts">
import type { ThinkingItem } from 'vue-element-plus-x/types/components/Thinking/types'
import { Check, DocumentCopy, Refresh, Search, Star } from '@element-plus/icons-vue'
import { demoStr } from './str.ts'

const avatar = ref(
  'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
)
const loading = ref(true)
const content = ref('')
const switchHighlight = ref(false)

const thinkingItems = ref<ThinkingItem[]>([
  {
    id: '1',
    content: '收到问题',
    title: '进行搜索文字',
    type: 'success',
    dotIcon: markRaw(Check),
    isCanExpand: true,
    isDefaultExpand: true,
    isLoading: true,
    expandContent: '进行搜索文字',
  },
])

setTimeout(() => {
  thinkingItems.value[0] = {
    ...thinkingItems.value[0],
    isLoading: false,
    type: 'success',
  }
  thinkingItems.value.push({
    id: '2',
    content: '解决问题',
    title: '进行搜索文字',
    hideTitle: true,
    type: 'primary',
    dotIcon: Check,
    isLoading: false,
    isCanExpand: true,
    isDefaultExpand: true,
    expandContent: '进行搜索文字',
  })
  setTimeout(() => {
    content.value = demoStr.trim()
    loading.value = false
  }, 500)
}, 4000)
</script>

<template>
  <div class="component-container">
    <el-switch v-model="switchHighlight" size="large" active-text="Shiki" inactive-text="Prism" />
    <div class="component-1">
      <Bubble placement="start" :content="content" shape="corner" variant="shadow" :loading="loading" :typing="{
        step: 2,
        suffix: '💗',
      }" :is-markdown="true" :code-high-light-options="{
          type: switchHighlight ? 'Shiki' : 'Prism',
        }">
        <template #avatar>
          <el-avatar :size="32" :src="avatar" />
        </template>

        <template #header>
          <div class="header-container">
            <Thinking :thinking-items="thinkingItems" @handle-expand="(id: string[]) => console.log(id)" />
          </div>
        </template>

        <!-- <template #content>
          <div class="content-container">在这里可以自定义内容，支持插槽。</div>
        </template> -->

        <template #footer>
          <div class="footer-container">
            <el-button type="info" :icon="Refresh" size="small" circle />
            <el-button type="success" :icon="Search" size="small" circle />
            <el-button type="warning" :icon="Star" size="small" circle />
            <el-button color="#626aef" :icon="DocumentCopy" size="small" circle />
          </div>
        </template>
      </Bubble>
    </div>

    <br>
    <div class="component-1">
      <Bubble placement="start" :content="content" shape="corner" variant="shadow" :loading="loading" :typing="{
        step: 2,
        suffix: '💗',
      }" :is-markdown="true" :code-high-light-options="{
          type: switchHighlight ? 'Shiki' : 'Prism',
        }">
        <template #avatar>
          <el-avatar :size="32" :src="avatar" />
        </template>

        <template #header>
          <div class="header-container">
            我是头部内容
          </div>
        </template>

        <!-- <template #content>
          <div class="content-container">在这里可以自定义内容，支持插槽。</div>
        </template> -->

        <template #footer>
          <div class="footer-container">
            <el-button type="info" :icon="Refresh" size="small" circle />
            <el-button type="success" :icon="Search" size="small" circle />
            <el-button type="warning" :icon="Star" size="small" circle />
            <el-button color="#626aef" :icon="DocumentCopy" size="small" circle />
          </div>
        </template>
      </Bubble>
    </div>
  </div>
</template>

<style scoped lang="scss">
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;

  .component-1 {
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
