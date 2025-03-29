<script setup lang="ts">
import { useXAgent, useXChat } from 'vue-element-plus-x'

const BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions'
const PATH = ''
const MODEL = 'qwen-vl-plus'
const API_KEY = ''

const agent = useXAgent({
  baseURL: BASE_URL + PATH,
  model: MODEL,
  dangerouslyApiKey: API_KEY,
  stream: true,
})
const senderValue = ref('')
const senderLoading = ref(false)

function getRequestParams(messages: any[]) {
  return {
    messages: messages.map(i => ({
      role: i.role,
      content: i.content || i.message,
    })),
  }
}

const { onRequest, messages } = useXChat({
  agent,
  requestPlaceholder: 'Waiting...',
  requestFallback: 'Mock failed return. Please try again later.',
  getRequestParams,
})

const list = computed(() => {
  return messages.value.map((item: any) => {
    const { role, status } = item
    const placement = role === 'assistant' ? 'start' : 'end'

    if (!item.content) {
      item.content = ''
    }

    if (role === 'assistant') {
      if (item.message?.data) {
        if (item.status === 'updating' && item.message?.data.indexOf('[DONE]') === -1) {
          const data = JSON.parse(item.message?.data)
          item.content += data.choices[0]?.delta?.content
        }
      }
    }
    else {
      item.content = item.message
    }

    const loading = status === 'loading'
    const isMarkdown = true
    const typing = true
    const avatar = role === 'assistant'
      ? 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      : 'https://avatars.githubusercontent.com/u/76239030?v=4'

    return {
      key: item.id,
      role: item.role,
      placement,
      content: item.content,
      loading,
      isMarkdown,
      typing,
      avatar,
      avatarSize: '24px',

    }
  })
})

function doRequest() {
  onRequest(senderValue.value)
}
</script>

<template>
  <div class="component-container">
    <BubbleList class="chat-list" :list="list" max-height="350px" />
    <Sender v-model:value="senderValue" class="sender" :loading="senderLoading" clearable @submit="doRequest" />
  </div>
</template>

<style scoped lang="scss">
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.sender {
  height: 60px;
  margin-top: 20px;
}

.chat-list {
  flex: 1;
  overflow: auto;
}
</style>
