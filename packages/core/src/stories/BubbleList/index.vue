<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type {
  BubbleListInstance,
  BubbleListProps
} from '@components/BubbleList/types';
import { avatar1, avatar2 } from '@assets/mock';
import BubbleList from '@components/BubbleList/index.vue';
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
    ? '这是用户的消息'
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
    <div class="component-title" style="color: red">
      气泡列表的 list 数组中的 item 属性，会直接透传到内置的 bubble
      组件中，也就是每一个消息气泡的属性，都是用这个数组控制。因此 bubble
      组件的属性都可以放在列表项中，同时也可以自己拓展每一项的属性做自定义的拓展处理。
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
      />
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
