<docs>
---
title: Streaming Follow
---

When `autoScroll` is enabled (default), content height changes during streaming output will automatically follow to the bottom. After the user scrolls up, following is interrupted; scrolling back to the bottom resumes automatically — no extra configuration needed.

::: tip Custom Follow Strategy
For custom follow logic (e.g., only force follow for own messages), use the `shouldFollowContent` callback to take over decision making. The `reason` field in the callback parameter indicates the trigger source: `own-message` (own send), `streaming` (streaming increment), `new-message` (newly appended message).
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
  'Click "Start Streaming" then scroll up to observe follow interruption; scroll back to bottom to observe auto-resume.'
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
    return `Round ${currentRound} increment #${idx + 1}: continuously observe whether the bubble sticks to the bottom as content grows, whether scrolling up only accumulates unread without interrupting reading, and whether returning to bottom immediately resumes auto-follow. `;
  });
  return Array.from(paragraphs.join('')).slice(0, total);
}

function stopStreaming(reason = 'Streaming stopped.') {
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
          ? `Warm-up AI message ${i + 1}: This is seed data for streaming follow verification.`
          : `Warm-up user message ${i + 1}`
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
    'Click "Start Streaming" then scroll up to observe follow interruption; scroll back to bottom to observe auto-resume.';
  streamCharacters = [];
  streamOffset = 0;

  return list;
}

function resetConversation() {
  stopStreaming('Current streaming session has been reset.');
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

  // Append a user question first
  bubbleItems.value.push(
    createMessage(
      ++nextKey,
      'user',
      `Round ${currentRound} question: Please summarize the key upgrades of BubbleList in streaming output and pagination scenarios.`
    )
  );

  // Prepare streaming characters
  streamCharacters = buildStreamingChars(currentRound);
  streamCharTotal.value = streamCharacters.length;

  // Initial chunk
  const initialChunk = streamCharacters
    .slice(0, STREAM_CHARS_PER_TICK)
    .join('');
  streamOffset = initialChunk.length;
  emittedCharCount.value = streamOffset;
  streamTick.value = initialChunk.length > 0 ? 1 : 0;

  // Append AI message
  bubbleItems.value.push(createMessage(++nextKey, 'ai', initialChunk));

  isStreaming.value = true;
  lastAction.value = `Streaming in progress: appending ${STREAM_CHARS_PER_TICK} chars every ${STREAM_TICK_MS}ms, total ~${streamCharTotal.value} chars.`;

  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });

  // Periodic append
  streamTimer = window.setInterval(() => {
    const currentItem = bubbleItems.value[bubbleItems.value.length - 1];
    if (!currentItem || currentItem.role !== 'ai') {
      stopStreaming('Streaming message lost, simulation terminated.');
      return;
    }

    if (
      streamOffset >= streamCharacters.length ||
      streamTick.value >= STREAM_TOTAL_TICKS
    ) {
      stopStreaming('Streaming output complete.');
      return;
    }

    const nextChunk = streamCharacters
      .slice(streamOffset, streamOffset + STREAM_CHARS_PER_TICK)
      .join('');

    if (!nextChunk) {
      stopStreaming('Streaming output complete.');
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
      stopStreaming('Streaming output complete.');
    }
  }, STREAM_TICK_MS);
}

function simulateInterrupt() {
  if (!bubbleListRef.value) return;
  bubbleListRef.value.scrollToTop(false);
  lastAction.value =
    'Scrolled to top — new chunks will pause follow. Return to bottom to auto-resume.';
}

function resumeFollow() {
  bubbleListRef.value?.scrollToBottom(false);
  lastAction.value =
    'Returned to bottom (scrollToBottom) — streaming content will continue to follow.';
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
        ><strong>Core Experience Flow</strong>: ① Click "Start Streaming" → ②
        Wait for AI output → ③ <strong>Scroll up</strong> to interrupt → ④
        Observe unread count increase, list stops jumping → ⑤ Click "Return to
        Bottom" → ⑥ Observe subsequent chunks auto-follow</span
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
          Start Streaming
        </el-button>
        <el-button
          size="small"
          type="warning"
          plain
          :disabled="!isStreaming"
          @click="simulateInterrupt"
        >
          Scroll to Top (Simulate Scroll Up)
        </el-button>
        <el-button size="small" type="success" plain @click="resumeFollow">
          Return to Bottom
        </el-button>
        <el-button
          size="small"
          type="danger"
          plain
          :disabled="!isStreaming"
          @click="stopStreaming('Manually stopped')"
        >
          Stop Streaming
        </el-button>
        <el-button size="small" type="info" plain @click="resetConversation">
          Reset Session
        </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-chip">
        <span>Scroll State</span
        ><strong :class="`state-${scrollState.toLowerCase()}`">{{
          scrollState
        }}</strong>
      </div>
      <div class="status-chip">
        <span>Unread Count</span><strong>{{ unreadCount }}</strong>
      </div>
      <div class="status-chip">
        <span>Stream Status</span
        ><strong :class="isStreaming ? 'streaming' : ''">{{
          isStreaming ? 'In Progress' : 'Idle'
        }}</strong>
      </div>
      <div class="status-chip">
        <span>Current Round</span><strong>{{ Math.max(round - 1, 0) }}</strong>
      </div>
      <div class="status-chip">
        <span>Chars Emitted</span
        ><strong>{{ emittedCharCount }}/{{ streamCharTotal }}</strong>
      </div>
      <div class="status-chip">
        <span>Running Tick</span
        ><strong>{{ streamTick }}/{{ STREAM_TOTAL_TICKS }}</strong>
      </div>
    </div>

    <div class="activity-bar">
      <span>Last Action</span><strong>{{ lastAction }}</strong>
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
    height: 420px;
    padding: 8px 10px;
    border-radius: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
  }
}
</style>
