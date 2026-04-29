<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type { BubbleListInstance } from '@components/BubbleList/types';
import type { ThinkingStatus } from '@components/Thinking/types';
import ConfigProvider from '@components/ConfigProvider/index.vue';
import Thinking from '@components/Thinking/index.vue';
import { Loading, Position } from '@element-plus/icons-vue';
import { useXStream } from '../../hooks/useXStream';
import { en } from '../../locale';

const { startStream, cancel, data, error, isLoading } = useXStream();

interface MessageItems extends MessageItem {
  reasoning_content?: string;
}

const BASE_URL = 'https://api.siliconflow.cn/v1/chat/completions';
// 仅供测试，请勿拿去测试其他付费模型
const API_KEY = 'sk-vfjyscildobjnrijtcllnkhtcouidcxdgjxtldzqzeowrbga';
const MODEL = 'THUDM/GLM-Z1-9B-0414';

const inputValue = ref('帮我写一篇小米手机介绍');
const senderRef = ref<any>(null);
const bubbleItems = ref<MessageItems[]>([]);
const bubbleListRef = ref<BubbleListInstance | null>(null);
const processedIndex = ref(0);
const attrs = useAttrs();

// 封装数据处理逻辑
function handleDataChunk(chunk: string) {
  if (chunk === ' [DONE]') {
    console.log('数据接收完毕');
    // 停止打字器状态
    if (bubbleItems.value.length) {
      bubbleItems.value[bubbleItems.value.length - 1].typing = false;
    }
    cancel();
    return;
  }
  try {
    // console.log('New chunk:', JSON.parse(chunk))
    const reasoningChunk = JSON.parse(chunk).choices[0].delta.reasoning_content;
    if (reasoningChunk) {
      // 开始思考链状态
      bubbleItems.value[bubbleItems.value.length - 1].thinkingStatus =
        'thinking';
      bubbleItems.value[bubbleItems.value.length - 1].loading = true;
      if (bubbleItems.value.length) {
        bubbleItems.value[bubbleItems.value.length - 1].reasoning_content +=
          reasoningChunk;
      }
    }

    const parsedChunk = JSON.parse(chunk).choices[0].delta.content;
    if (parsedChunk) {
      // 结束 思考链状态
      bubbleItems.value[bubbleItems.value.length - 1].thinkingStatus = 'end';
      bubbleItems.value[bubbleItems.value.length - 1].loading = false;

      if (bubbleItems.value.length) {
        bubbleItems.value[bubbleItems.value.length - 1].content += parsedChunk;
      }
    }
  } catch (err) {
    console.error('解析数据时出错:', err);
  }
}

watch(
  data,
  () => {
    for (let i = processedIndex.value; i < data.value.length; i++) {
      const chunk = data.value[i].data;
      handleDataChunk(chunk);
      processedIndex.value++;
    }
  },
  { deep: true }
);

// 封装错误处理逻辑
function handleError(err: any) {
  console.error('Fetch error:', err);
}

async function startSSE() {
  try {
    // 添加用户输入的消息
    console.log('inputValue.value', inputValue.value);
    addMessage(inputValue.value, true);
    addMessage('', false);

    // 这里有必要调用一下 BubbleList 组件的滚动到底部 手动触发 自动滚动
    bubbleListRef.value!.scrollToBottom();

    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: bubbleItems.value
          .filter((item: any) => item.role === 'user')
          .map((item: any) => ({
            role: item.role,
            content: item.content
          })),
        stream: true
      })
    });
    const readableStream = response.body!;
    // 重置状态
    processedIndex.value = 0;
    await startStream({ readableStream });
  } catch (err) {
    handleError(err);
  }
}

// 添加消息 - 维护聊天记录
function addMessage(message: string, isUser: boolean) {
  const i = bubbleItems.value.length;
  const obj: MessageItems = {
    key: i,
    avatar: isUser
      ? 'https://avatars.githubusercontent.com/u/76239030?v=4'
      : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    avatarSize: '48px',
    role: isUser ? 'user' : 'system',
    placement: isUser ? 'end' : 'start',
    isMarkdown: !isUser,
    variant: 'shadow',
    shape: 'corner',
    // maxWidth: '500px',
    typing: isUser ? false : { step: 2, suffix: '❤️‍🔥', interval: 80 },
    isFog: isUser ? false : { bgColor: '#FFFFFF' },
    loading: !isUser,
    content: message || '',
    reasoning_content: '',
    thinkingStatus: 'start'
  };
  bubbleItems.value.push(obj);
}

// 展开收起 事件展示
function handleChange(payload: { value: boolean; status: ThinkingStatus }) {
  console.log('value', payload.value, 'status', payload.status);
}
</script>

<template>
  <div class="component-container">
    <div class="header-wrap">
      此处是拿硅基流动中的免费模型进行测试，仅供预览使用
      <p>和 BubbleList 组合使用，支持放在 气泡头部，或者 气泡自定义内容中</p>
    </div>

    <div class="locale-preview">
      <Thinking content="默认情况下使用中文文案" status="thinking" />
      <ConfigProvider :locale="en">
        <Thinking
          content="Switch labels through ConfigProvider locale"
          status="thinking"
        />
      </ConfigProvider>
    </div>

    <div class="chat-warp">
      <div v-if="error" class="error">
        {{ error.message }}
      </div>
      <BubbleList ref="bubbleListRef" :list="bubbleItems">
        <template #header="{ item }">
          <Thinking
            v-if="item.reasoning_content"
            v-bind="attrs"
            :content="item.reasoning_content"
            :status="item.thinkingStatus"
            class="thinking-chain-warp"
            @change="handleChange"
          />
        </template>

        <template #content="{ item }">
          <Thinking
            v-if="item.reasoning_content"
            :content="item.reasoning_content"
            :status="item.thinkingStatus"
            duration=".3s"
            max-width="350px"
            button-width="100%"
            background-color="linear-gradient(to right, #ffd3d8e0, #ff6969e7)"
            color="black"
            class="thinking-chain-warp"
          >
            <template #status-icon="{ status }">
              <span v-if="status === 'start'">💡</span>
              <span v-if="status === 'thinking'">💖</span>
              <span v-if="status === 'end'">✅</span>
              <span v-if="status === 'error'">❌</span>
            </template>

            <template #label="{ status }">
              <span v-if="status === 'start'">开始思考 😄</span>
              <span v-if="status === 'thinking'">让我想想 🤔</span>
              <span v-if="status === 'end'">想出来啦 😆</span>
              <span v-if="status === 'error'">想不出来 🥵</span>
            </template>

            <template #arrow> 👇 </template>

            <template #error>
              <span class="error-color">思考报错</span>
            </template>

            <template #content="{ content }">
              这里是自定义内容 + 返回：{{ content }}
            </template>
          </Thinking>

          <Typewriter
            :content="item.content"
            :loading="item.loading"
            :typing="item.typing"
            :is-markdown="item.isMarkdown"
            :is-fog="item.isFog"
          />
        </template>
      </BubbleList>
      <Sender ref="senderRef" v-model="inputValue" @submit="startSSE">
        <template #action-list>
          <div class="footer-container">
            <el-button
              v-if="!isLoading"
              type="danger"
              circle
              @click="senderRef.submit()"
            >
              <el-icon><Position /></el-icon>
            </el-button>
            <el-button v-if="isLoading" type="primary" @click="cancel">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
            </el-button>
          </div>
        </template>
      </Sender>
    </div>
  </div>
</template>

<style scoped lang="scss">
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;

  .locale-preview {
    display: grid;
    gap: 12px;
    padding: 12px;
  }

  .header-wrap {
    padding: 12px;
  }
  .chat-warp {
    height: calc(100vh - 160px);
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .thinking-chain-warp {
      margin-bottom: 12px;
    }
  }

  :deep() {
    .el-bubble-list {
      padding-top: 24px;
    }

    .el-bubble {
      padding: 0 12px;
      padding-bottom: 24px;
    }

    .el-typewriter {
      border-radius: 12px;
      overflow: hidden;
    }

    .markdown-body {
      background-color: transparent;
    }
  }
}
</style>
