<!-- home 首页 - 使用 BubbleList 组件 -->
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

async function doRequest() {
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
</script>

<template>
  <div class="component-container">
    <el-button dark type="success" plain @click="doRequest">
      请求{{ BASE_URL + PATH }}地址
    </el-button>
    <div v-if="content">
      <Bubble :content="content" :typing="{ step: 1, interval: 100, suffix: '💩' }">
        <template #avatar>
          <el-avatar :src="avatarAI" />
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
  min-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // overflow: auto;

}
</style>
