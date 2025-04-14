<!-- home 首页 - 使用 BubbleList 组件 -->
<script setup lang="ts">
import type { MessageItem } from '@/assets/mock'
import { messageArr } from '@/assets/mock'
import BubbleList from 'vue-element-plus-x/src/components/BubbleList/index.vue'

const bubbleItems = ref<MessageItem[]>(messageArr)

const bubbleListRef = ref()
const num = ref(0)

function addMessage() {
  const i = bubbleItems.value.length
  const isUser = !!(i % 2)
  const content = isUser
    ? 'Mock user content.'
    : 'Mock AI content. '.repeat(100)
  const placement = isUser ? 'end' : 'start'
  const typing = isUser ? false : { step: 2, suffix: '...' }
  const obj = {
    key: i,
    role: isUser ? 'user' : 'ai',
    content,
    placement,
    typing,
    isFog: true,
  }
  bubbleItems.value.push(obj as MessageItem)
  bubbleListRef.value.scrollToBottom()
}

function onCompleteFunc(_self: unknown) {
  // console.log('列表打字结束', self)
}

function scrollToTop() {
  bubbleListRef.value.scrollToTop()
}

function scrollToBubble() {
  bubbleListRef.value.scrollToBubble(num.value)
}

onMounted(() => {
  setTimeout(() => {
    bubbleItems.value.map((item: MessageItem) => {
      item.loading = false
      return item
    })
  }, 3000)
})
</script>

<template>
  <div class="component-container">
    <p>1. 气泡列表组件，同样继承 雾化效果，点击添加对话预览 </p>
    <p>2. 新版本 支持回到底部按钮，支持 鼠标悬停出现滚动条增强 交互体验 </p>
    <div class="top-wrap">
      <div class="btn-list">
        <el-button type="primary" plain @click="addMessage">
          添加对话
        </el-button>
        <el-button type="primary" plain @click="scrollToTop">
          滚动到顶部
        </el-button>
        <el-input-number v-model="num" :min="0" :max="10" controls-position="right" />
        <el-button type="primary" plain @click="scrollToBubble">
          滚动第{{ num }}个气泡框
        </el-button>
      </div>
    </div>

    <div class="component-1">
      <BubbleList
        ref="bubbleListRef"
        v-model:list="bubbleItems"
        :show-default-footer-content="true"
        @on-complete="onCompleteFunc"
      >
        <template #avatar="{ item }">
          <el-avatar :size="32" :src="item.avatar" />
        </template>

        <template #header="{ item }">
          <div class="header-container">
            {{
              item.role === "ai" ? "机器人头部自定义内容" : "用户头部自定义内容"
            }}
          </div>
        </template>

        <!-- 自定义 content -->
        <!-- <template #content="{ item }">
          <div class="content-container">
            {{ item.content }}
          </div>
        </template> -->

        <template #footer="{ item }">
          <div class="footer-container">
            {{
              item.role === "ai" ? "机器人底部自定义内容" : "用户底部自定义内容"
            }}
          </div>
        </template>

        <template #loading="{ item }">
          <div class="loading-container">
            {{
              item.role === "ai" ? "机器人自定义加载动画" : "用户自定义加载动画"
            }}
          </div>
        </template>

        <!-- <template #backToBottom>
          <el-button circle style="padding: 23px; font-size: 20px;">
            💖
          </el-button>
        </template> -->
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;

  .btn-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }

  .top-wrap {
    margin: 12px 0;
  }
}
</style>
