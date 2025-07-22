<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type {
  BubbleListInstance,
  BubbleListProps
} from '@components/BubbleList/types';
import { avatar1, avatar2 } from '@assets/mock';
import BubbleList from '@components/BubbleList/index.vue';
import { DocumentCopy, Refresh, Search, Star } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

const props = defineProps<Pick<BubbleListProps, 'list'>>();

const bubbleItems = ref<BubbleListProps<MessageItem>['list']>(
  props.list as BubbleListProps<MessageItem>['list']
);

const bubbleListRef = ref<BubbleListInstance | null>(null);
const num = ref(0);

function addMessage() {
  const i = bubbleItems.value.length;
  const isUser = !!(i % 2);
  const content = isUser
    ? 'Mock user content.'
    : '欢迎使用 Element Plus X .'.repeat(5);
  const placement = isUser ? 'end' : 'start';
  const typing = isUser ? false : { step: 2, suffix: '...' };
  const obj = {
    key: i,
    role: isUser ? 'user' : 'ai',
    content,
    placement,
    typing,
    isFog: true,
    avatar: isUser ? avatar1 : avatar2,
    avatarSize: '32px'
  };
  bubbleItems.value.push(obj as MessageItem);
  bubbleListRef.value?.scrollToBottom();
  ElMessage.success(`条数：${bubbleItems.value.length}`);
}

function handleOnComplete(_self: unknown) {
  ElMessage.success('列表打字结束');
}

function scrollToTop() {
  bubbleListRef.value?.scrollToTop();
}

function scrollToBubble() {
  bubbleListRef.value?.scrollToBubble(num.value);
}

onMounted(() => {
  setTimeout(() => {
    bubbleItems.value.map((item: MessageItem) => {
      item.loading = false;
      return item;
    });
  }, 3000);
});
</script>

<template>
  <div class="component-container">
    <div class="component-title">
      支持 头像插槽、头部插槽、内容插槽、加载中插槽、底部插槽、底部按钮插槽
    </div>
    <div class="top-wrap">
      <div class="btn-list">
        <el-button type="primary" plain @click="addMessage">
          添加对话
        </el-button>
        <el-button type="primary" plain @click="scrollToTop">
          滚动到顶部
        </el-button>
        <el-input-number
          v-model="num"
          :min="0"
          :max="10"
          controls-position="right"
        />
        <el-button type="primary" plain @click="scrollToBubble">
          滚动第{{ num }}个气泡框
        </el-button>
      </div>
    </div>

    <div class="component-1">
      <BubbleList
        v-bind="{ ...$attrs, ...props }"
        ref="bubbleListRef"
        :list="bubbleItems"
        @complete="handleOnComplete"
      >
        <template #avatar="{ item }">
          <img
            :src="item.avatar"
            class="avatar"
            :style="{ width: item.avatarSize, height: item.avatarSize }"
          />
        </template>

        <template #header="{ item }">
          <div class="header-time">
            {{
              item.role === 'ai'
                ? `AI 头部自定义内容 ${new Date().toLocaleString()}`
                : `用户头部自定义内容 ${new Date().toLocaleString()}`
            }}
          </div>
        </template>

        <!-- 自定义 content -->
        <template #content="{ item }">
          <div class="content">
            {{ item.content }}
          </div>
        </template>

        <template #footer="{ item }">
          <div class="footer-container">
            <el-button type="info" :icon="Refresh" size="small" circle />
            <el-button
              v-if="item.role === 'ai'"
              type="success"
              :icon="Search"
              size="small"
              circle
            />
            <el-button
              v-if="item.role === 'ai'"
              type="warning"
              :icon="Star"
              size="small"
              circle
            />
            <el-button
              color="#626aef"
              :icon="DocumentCopy"
              size="small"
              circle
            />
          </div>
        </template>

        <template #loading>
          <div class="loading-container">
            <div class="dot1" />
            <div class="dot2" />
            <div class="dot3" />
          </div>
        </template>

        <template #backToBottom>
          <el-button circle style="padding: 23px; font-size: 20px">
            💖
          </el-button>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.component-container {
  background-color: white;
  padding: 12px;
  border-radius: 15px;
  overflow: auto;

  .component-title {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 12px;
    font-weight: 700;
    line-height: 1.5;
    margin-bottom: 12px;
    margin-top: 24px;

    &::after {
      position: absolute;
      content: '';
      display: block;
      width: 5px;
      height: 75%;
      border-radius: 15px;
      left: 0;
      background-color: #409eff;
    }
  }

  .avatar {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  .header-time {
    margin-bottom: 4px;
  }

  .content {
    font-size: 14px;
    font-weight: 700;
    color: #333;
    padding: 12px;
    background: linear-gradient(to right, #fdfcfb 0%, #ffd1ab 100%);
    border-radius: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .footer-container {
    :deep() {
      .el-button + .el-button {
        margin-left: 8px;
      }
    }
  }

  .loading-container {
    display: flex;
    gap: 4px;
    .dot1,
    .dot2,
    .dot3 {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .dot1 {
      animation: jump 1.6s -0.32s linear infinite;
      background: #626aef;
    }

    .dot2 {
      animation: jump 1.6s -0.16s linear infinite;
      background: #626aef;
    }

    .dot3 {
      animation: jump 1.6s linear infinite;
      background: #626aef;
    }

    @keyframes jump {
      0%,
      80%,
      100% {
        -webkit-transform: scale(0);
        transform: scale(0);
      }

      40% {
        -webkit-transform: scale(0.8);
        transform: scale(0.8);
      }
    }
  }

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
