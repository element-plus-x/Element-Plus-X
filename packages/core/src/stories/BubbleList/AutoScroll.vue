<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type {
  BubbleListInstance,
  BubbleListProps,
  BubbleListScrollState
} from '@components/BubbleList/types';
import BubbleList from '@components/BubbleList/index.vue';
import {
  createStoryMessage,
  createStorySeed,
  getLastMessageKey
} from './story-utils';

const props = withDefaults(
  defineProps<Partial<BubbleListProps<MessageItem>>>(),
  {
    list: () => []
  }
);

const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<MessageItem[]>([]);
const autoScroll = ref(true);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
let nextKey = 0;

function buildSeedList(source?: MessageItem[]) {
  const list = createStorySeed(
    source && source.length > 0 ? source : undefined,
    8,
    'autoScroll 示例'
  );
  nextKey = getLastMessageKey(list);
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  return list;
}

function resetConversation(source?: MessageItem[]) {
  bubbleItems.value = buildSeedList(source);
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

function handleReset() {
  resetConversation(props.list as MessageItem[] | undefined);
}

function appendMessage(role: 'ai' | 'user') {
  nextKey += 1;
  const content =
    role === 'user'
      ? `用户追加消息 ${nextKey}：测试 autoScroll 开关对自动触底的影响。`
      : `AI 追加回复 ${nextKey}：当 autoScroll 开启时，此消息自动出现在底部。关闭后，未读计数累计并显示角标。`;
  bubbleItems.value.push(createStoryMessage(nextKey, role, content));
}

function appendBurst() {
  for (let i = 0; i < 5; i++) {
    appendMessage(i % 2 === 0 ? 'ai' : 'user');
  }
}

function handleScrollStateChange(state: BubbleListScrollState) {
  scrollState.value = state;
}

function handleUnreadCountChange(count: number) {
  unreadCount.value = count;
}

onMounted(() => {
  resetConversation(props.list as MessageItem[] | undefined);
});
</script>

<template>
  <div
    style="
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      height: 100%;
      box-sizing: border-box;
    "
  >
    <!-- 控制面板 -->
    <div
      style="
        display: flex;
        flex-direction: column;
        gap: 10px;
        border: 1px solid #e4e7ed;
        border-radius: 12px;
        padding: 14px;
      "
    >
      <div
        style="
          font-size: 15px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 4px;
        "
      >
        ⚙️ AutoScroll 自动触底控制台
      </div>

      <div
        style="
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #fafafa;
          border-radius: 8px;
          padding: 12px 14px;
        "
      >
        <div style="display: flex; flex-direction: column; gap: 2px">
          <strong style="color: #303133; font-size: 14px">autoScroll</strong>
          <span style="font-size: 12px; color: #909399">
            {{
              autoScroll
                ? '已开启 — 新消息自动触底'
                : '已关闭 — 累计未读，需手动回底'
            }}
          </span>
        </div>
        <el-switch
          v-model="autoScroll"
          active-text="开启"
          inactive-text="关闭"
        />
      </div>

      <div style="display: flex; gap: 8px; flex-wrap: wrap">
        <el-button
          type="primary"
          plain
          size="small"
          @click="appendMessage('user')"
        >
          + 用户消息
        </el-button>
        <el-button
          type="success"
          plain
          size="small"
          @click="appendMessage('ai')"
        >
          + AI 回复
        </el-button>
        <el-button type="warning" plain size="small" @click="appendBurst">
          批量追加 5 条
        </el-button>
        <el-button size="small" @click="handleReset"> 重置会话 </el-button>
      </div>

      <div
        :style="{
          marginTop: '6px',
          padding: '10px 12px',
          borderRadius: '8px',
          fontSize: '13px',
          lineHeight: '1.6',
          display: 'flex',
          gap: '8px',
          background: autoScroll ? '#f0f9eb' : '#fef0f0',
          border: autoScroll ? '1px solid #e1f3d8' : '1px solid #fde2e2',
          color: autoScroll ? '#67c23a' : '#f56c6c'
        }"
      >
        <span style="font-size: 18px; flex-shrink: 0">{{
          autoScroll ? '✅' : '⚠️'
        }}</span>
        <div>
          <template v-if="autoScroll">
            <strong>自动追底模式</strong><br />
            所有新消息自动滚动到底部，未读计数始终为 0。
          </template>
          <template v-else>
            <strong>手动控制模式</strong><br />
            新消息不自动滚动，未读数开始累计。回底按钮显示红色角标，点击后清零。
          </template>
        </div>
      </div>
    </div>

    <!-- BubbleList -->
    <div style="flex: 1; min-height: 0">
      <BubbleList
        ref="bubbleListRef"
        :list="bubbleItems"
        :auto-scroll="autoScroll"
        max-height="100%"
        :always-show-scrollbar="true"
        :show-back-button="true"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <template #backToBottom="context">
          <div
            :style="{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 18px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #409eff 0%, #337ecc 100%)',
              color: '#fff',
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: '0 2px 12px rgba(64, 158, 255, 0.35)',
              userSelect: 'none',
              zIndex: 10
            }"
            @click="context.scrollToBottom(true)"
          >
            <span style="font-size: 14px; font-weight: 700">↓</span>
            <span style="white-space: nowrap">回到底部</span>
            <span
              v-if="context.unreadCount > 0"
              :style="{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '18px',
                height: '18px',
                padding: '0 5px',
                borderRadius: '9px',
                background: '#f56c6c',
                color: '#fff',
                fontSize: '11px',
                fontWeight: 700,
                lineHeight: 1
              }"
            >
              {{ context.unreadCount > 99 ? '99+' : context.unreadCount }}
            </span>
          </div>
        </template>
      </BubbleList>
    </div>

    <!-- 状态栏 -->
    <div
      style="
        display: flex;
        gap: 16px;
        padding: 10px 14px;
        background: #f5f7fa;
        border-radius: 8px;
        flex-wrap: wrap;
        font-size: 12px;
      "
    >
      <div style="display: flex; align-items: center; gap: 6px">
        <span style="color: #909399; font-family: monospace">scrollState</span>
        <el-tag
          :type="
            scrollState === 'AT_BOTTOM'
              ? 'success'
              : scrollState === 'SCROLLED_UP'
                ? 'warning'
                : 'danger'
          "
          size="small"
        >
          {{ scrollState }}
        </el-tag>
      </div>
      <div style="display: flex; align-items: center; gap: 6px">
        <span style="color: #909399; font-family: monospace">unreadCount</span>
        <el-tag :type="unreadCount > 0 ? 'danger' : 'info'" size="small">
          {{ unreadCount }}
        </el-tag>
      </div>
      <div style="display: flex; align-items: center; gap: 6px">
        <span style="color: #909399; font-family: monospace">autoScroll</span>
        <el-tag :type="autoScroll ? 'success' : 'danger'" size="small">
          {{ autoScroll ? 'ON' : 'OFF' }}
        </el-tag>
      </div>
    </div>
  </div>
</template>
