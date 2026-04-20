<docs>
---
title: 流式跟随
---

`autoScroll` 开启（默认）时，流式输出内容变高会自动贴底。用户上滑后跟随中断，回到底部后自动恢复——无需任何额外配置。

::: tip 自定义追底策略
如需自定义跟随逻辑（例如只有本端消息才强制追底），可通过 `shouldFollowContent` 回调接管决策。回调参数中的 `reason` 字段告知本次触发来源：`own-message`（本端发送）、`streaming`（流式增量）、`new-message`（新追加消息）。
:::
</docs>

<script setup lang="ts">
import type {
  BubbleListInstance,
  BubbleListScrollState
} from 'vue-element-plus-x/types/BubbleList';

interface MessageItem {
  key: number;
  role: 'user' | 'ai';
  placement: 'start' | 'end';
  content: string;
  avatar: string;
  avatarSize?: string;
  avatarGap?: string;
  shape?: string;
  variant?: string;
}

const STREAM_TICK_MS = 50;
const STREAM_CHARS_PER_TICK = 6;
const STREAM_TOTAL_TICKS = 120;

const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<MessageItem[]>([]);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const isStreaming = ref(false);
const streamTick = ref(0);
const emittedCharCount = ref(0);
const streamCharTotal = ref(0);
const round = ref(1);
const lastAction = ref(
  '点击"开始流式回复"，然后上滑观察跟随中断，回到底部观察自动恢复。'
);

let nextKey = 0;
let streamCharacters: string[] = [];
let streamOffset = 0;
let streamTimer: number | null = null;

function createMessage(
  key: number,
  role: 'user' | 'ai',
  content: string
): MessageItem {
  const isUser = role === 'user';
  return {
    key,
    role,
    placement: isUser ? 'end' : 'start',
    content,
    avatar: isUser
      ? 'https://avatars.githubusercontent.com/u/76239030?v=4'
      : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    avatarSize: '24px',
    avatarGap: '12px',
    shape: 'corner',
    variant: isUser ? 'outlined' : 'filled'
  };
}

function buildStreamingChars(currentRound: number): string[] {
  const total = STREAM_CHARS_PER_TICK * STREAM_TOTAL_TICKS;
  const paragraphs = Array.from({ length: STREAM_TOTAL_TICKS }, (_, idx) => {
    return `第${currentRound}轮第${idx + 1}次增量输出，用来持续观察气泡内容变高时是否始终贴底，用户上滑后是否只累计未读而不打断阅读，重新回到底部以后是否立刻恢复自动跟随。`;
  });
  return Array.from(paragraphs.join('')).slice(0, total);
}

function stopStreaming(reason = '已停止流式回复。') {
  if (streamTimer !== null) {
    window.clearInterval(streamTimer);
    streamTimer = null;
  }
  isStreaming.value = false;
  lastAction.value = reason;
}

function buildSeedList(): MessageItem[] {
  const list: MessageItem[] = [];
  for (let i = 0; i < 14; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    list.push(
      createMessage(
        i + 1,
        role,
        role === 'ai'
          ? `预热 AI 消息 ${i + 1}：这是用于流式跟随验证的种子数据。`
          : `预热用户消息 ${i + 1}`
      )
    );
  }

  nextKey = list.length;
  round.value = 1;
  streamTick.value = 0;
  emittedCharCount.value = 0;
  streamCharTotal.value = 0;
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  isStreaming.value = false;
  lastAction.value =
    '点击"开始流式回复"，然后上滑观察跟随中断，回到底部观察自动恢复。';
  streamCharacters = [];
  streamOffset = 0;

  return list;
}

function resetConversation() {
  stopStreaming('已重置当前流式会话。');
  bubbleItems.value = buildSeedList();
  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });
}

function startStreaming() {
  if (isStreaming.value) return;

  const currentRound = round.value;
  round.value += 1;
  streamTick.value = 0;
  emittedCharCount.value = 0;
  streamOffset = 0;

  // 先追加一条用户提问
  bubbleItems.value.push(
    createMessage(
      ++nextKey,
      'user',
      `第 ${currentRound} 轮提问：请总结 BubbleList 在流式输出与分页场景下的关键升级点。`
    )
  );

  // 准备流式字符
  streamCharacters = buildStreamingChars(currentRound);
  streamCharTotal.value = streamCharacters.length;

  // 初始 chunk
  const initialChunk = streamCharacters
    .slice(0, STREAM_CHARS_PER_TICK)
    .join('');
  streamOffset = initialChunk.length;
  emittedCharCount.value = streamOffset;
  streamTick.value = initialChunk.length > 0 ? 1 : 0;

  // 追加 AI 消息
  bubbleItems.value.push(createMessage(++nextKey, 'ai', initialChunk));

  isStreaming.value = true;
  lastAction.value = `流式输出进行中：每 ${STREAM_TICK_MS}ms 追加 ${STREAM_CHARS_PER_TICK} 个字，总量约 ${streamCharTotal.value} 字。`;

  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });

  // 定时追加
  streamTimer = window.setInterval(() => {
    const currentItem = bubbleItems.value[bubbleItems.value.length - 1];
    if (!currentItem || currentItem.role !== 'ai') {
      stopStreaming('流式消息已丢失，已终止当前模拟。');
      return;
    }

    if (
      streamOffset >= streamCharacters.length ||
      streamTick.value >= STREAM_TOTAL_TICKS
    ) {
      stopStreaming('流式输出完成。');
      return;
    }

    const nextChunk = streamCharacters
      .slice(streamOffset, streamOffset + STREAM_CHARS_PER_TICK)
      .join('');

    if (!nextChunk) {
      stopStreaming('流式输出完成。');
      return;
    }

    currentItem.content += nextChunk;
    streamOffset += nextChunk.length;
    emittedCharCount.value = streamOffset;
    streamTick.value += 1;

    if (
      streamOffset >= streamCharacters.length ||
      streamTick.value >= STREAM_TOTAL_TICKS
    ) {
      stopStreaming('流式输出完成。');
    }
  }, STREAM_TICK_MS);
}

function simulateInterrupt() {
  if (!bubbleListRef.value) return;
  bubbleListRef.value.scrollToTop(false);
  lastAction.value = '已滚动到顶部，新 chunk 将暂停跟随。回到底部后自动恢复。';
}

function resumeFollow() {
  bubbleListRef.value?.scrollToBottom(false);
  lastAction.value = '已回到底部（scrollToBottom），流式内容将持续跟随。';
}

function handleScrollStateChange(state: BubbleListScrollState) {
  scrollState.value = state;
}
function handleUnreadCountChange(count: number) {
  unreadCount.value = count;
}

onMounted(() => {
  resetConversation();
});
onUnmounted(() => {
  stopStreaming('');
});
</script>

<template>
  <div class="streaming-follow-demo">
    <div class="tip-banner">
      <span class="tip-icon">~</span>
      <span
        ><strong>核心体验流程</strong>：① 点"开始流式回复" → ② 等 AI 开始输出 →
        ③ <strong>向上滚动</strong>打断 → ④ 观察未读增加、列表不再跳动 → ⑤
        点"回到底部恢复" → ⑥ 观察后续 chunk 自动跟随</span
      >
    </div>

    <div class="toolbar-group">
      <div class="btn-list">
        <el-button
          size="small"
          type="primary"
          plain
          :disabled="isStreaming"
          @click="startStreaming"
        >
          开始流式回复
        </el-button>
        <el-button
          size="small"
          type="warning"
          plain
          :disabled="!isStreaming"
          @click="simulateInterrupt"
        >
          滚动到顶部（模拟上滑）
        </el-button>
        <el-button size="small" type="success" plain @click="resumeFollow">
          回到底部恢复
        </el-button>
        <el-button
          size="small"
          type="danger"
          plain
          :disabled="!isStreaming"
          @click="stopStreaming('已手动停止')"
        >
          停止流式回复
        </el-button>
        <el-button size="small" type="info" plain @click="resetConversation">
          重置会话
        </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-chip">
        <span>滚动状态</span
        ><strong :class="`state-${scrollState.toLowerCase()}`">{{
          scrollState
        }}</strong>
      </div>
      <div class="status-chip">
        <span>未读计数</span><strong>{{ unreadCount }}</strong>
      </div>
      <div class="status-chip">
        <span>流式状态</span
        ><strong :class="isStreaming ? 'streaming' : ''">{{
          isStreaming ? '进行中' : '空闲'
        }}</strong>
      </div>
      <div class="status-chip">
        <span>当前轮次</span><strong>{{ Math.max(round - 1, 0) }}</strong>
      </div>
      <div class="status-chip">
        <span>已输出字符</span
        ><strong>{{ emittedCharCount }}/{{ streamCharTotal }}</strong>
      </div>
      <div class="status-chip">
        <span>运行 tick</span
        ><strong>{{ streamTick }}/{{ STREAM_TOTAL_TICKS }}</strong>
      </div>
    </div>

    <div class="activity-bar">
      <span>最近动作</span><strong>{{ lastAction }}</strong>
    </div>

    <div class="story-stage">
      <BubbleList
        ref="bubbleListRef"
        :list="bubbleItems"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.streaming-follow-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;

  .tip-banner {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 14px;
    border-radius: 8px;
    background: linear-gradient(135deg, #fef0f0 0%, #fdf6ec 100%);
    border: 1px solid #fde2e2;
    font-size: 13px;
    color: #f56c6c;
    line-height: 1.7;
    .tip-icon {
      font-size: 18px;
      line-height: 1;
      margin-top: 2px;
    }
    strong {
      color: #303133;
    }
  }

  .toolbar-group {
    min-height: 0;
  }
  .btn-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .status-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 32px;
    padding: 0 12px;
    border-radius: 999px;
    background: #fff;
    border: 1px solid #dbeafe;
    span {
      font-size: 12px;
      color: #64748b;
      line-height: 1;
    }
    strong {
      font-size: 13px;
      color: #0f172a;
      line-height: 1;
      &.state-at_bottom {
        color: #67c23a;
      }
      &.state-scrolled_up {
        color: #e6a23c;
      }
      &.state-has_new_messages {
        color: #f56c6c;
      }
      &.streaming {
        color: #409eff;
        animation: blink 1.2s ease-in-out infinite;
      }
    }
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.45;
    }
  }

  .activity-bar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%);
    border: 1px solid #dbeafe;
    span {
      font-size: 12px;
      color: #64748b;
    }
    strong {
      font-size: 13px;
      color: #1e3a8a;
    }
  }

  .story-stage {
    min-height: 520px;
    height: 520px;
    padding: 10px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    overflow: hidden;
    display: flex;
  }

  .story-stage :deep(.elx-bubble-list) {
    width: 100%;
    height: 100%;
    min-height: 0;
    flex: 1 1 0;
    overflow: hidden;
  }
}
</style>
