<script setup lang="ts">
import { XRequest } from 'vue-element-plus-x'

const BASE_URL = 'https://api.example.com'
const PATH = '/chat'
const MODEL = 'gpt-3.5-turbo'
const avatarAI = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'

const exampleRequest = XRequest({
  baseURL: BASE_URL + PATH,
  model: MODEL,
  // dangerouslyApiKey: API_KEY
})
const content = ref('')

async function doRequestOpenAI() {
  await exampleRequest.create(
    {
      messages: [{ role: 'user', content: 'hello, who are u?' }],
      stream: true,
    },
    {
      onSuccess: (messages) => {
        console.log('onSuccess', messages)
      },
      onError: (error) => {
        console.error('onError', error)
      },
      onUpdate: (msg) => {
        content.value += msg
      },
    },

  )
}

async function mockFetch() {
  const sseEventData = `{data:{"id":"0","choices":[{"index":0,"delta":{"content":"Hello","role":"assistant"}}],"created":21212112,"model":"gpt-3.5-turbo"}}`

  const chunks = sseEventData.split('\n')

  const response = new Response(
    new ReadableStream({
      async start(controller) {
        for (const chunk of chunks) {
          await new Promise(resolve => setTimeout(resolve, 100))
          controller.enqueue(new TextEncoder().encode(chunk))
        }
        controller.close()
      },
    }),
    {
      headers: {
        'Content-Type': 'application/x-ndjson',
      },
    },
  )

  return response
}

const exampleRequest2 = XRequest({
  baseURL: BASE_URL + PATH,
  model: MODEL,
  fetch: mockFetch,
  // dangerouslyApiKey: API_KEY
})

const content2 = ref('')

async function doRequestCustom() {
  await exampleRequest2.create(
    {
      messages: [{ role: 'user', content: 'hello, who are u?' }],
      stream: true,
    },
    {
      onSuccess: (messages) => {
        console.log('onSuccess', messages)
      },
      onError: (error) => {
        console.error('onError', error)
      },
      onUpdate: (msg) => {
        content2.value += msg
      },
    },
    new TransformStream<string, string>({
      transform(chunk, controller) {
        controller.enqueue(chunk)
      },
    }),
  )
}
</script>

<template>
  <div class="component-container">
    <div class="openai-demo">
      <div>
        OpenAI标准
        <el-button dark type="success" plain @click="doRequestOpenAI">
          请求{{ BASE_URL + PATH }}地址
        </el-button>
      </div>

      <div v-if="content">
        <Bubble :content="content" :typing="{ step: 1, interval: 100, suffix: '💩' }">
          <template #avatar>
            <el-avatar :src="avatarAI" />
          </template>
        </Bubble>
      </div>
    </div>

    <div class="custom-demo">
      <div>
        自定义fetch
        <el-button dark type="success" plain @click="doRequestCustom">
          请求
        </el-button>
      </div>
      <div v-if="content2">
        <Bubble :content="content2" :typing="{ step: 1, interval: 100, suffix: '💩' }">
          <template #avatar>
            <el-avatar :src="avatarAI" />
          </template>
        </Bubble>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;
  min-height: 400px;
}

.openai-demo {
  margin: 10px 0;
}
</style>
