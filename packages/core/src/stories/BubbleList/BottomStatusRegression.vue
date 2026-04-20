<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type {
  BubbleListBoundaryState,
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

type BottomStatusMode = 'none' | 'loading' | 'no-more';
type BottomHeightMode = 'adaptive' | 'fixed';

const props = withDefaults(
  defineProps<Partial<BubbleListProps<MessageItem>>>(),
  {
    list: () => []
  }
);

const STREAM_TICK_MS = 70;
const STREAM_CHARS_PER_TICK = 8;

const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<MessageItem[]>([]);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const bottomStatusMode = ref<BottomStatusMode>('none');
const bottomHeightMode = ref<BottomHeightMode>('adaptive');
const isStreaming = ref(false);
const emittedCharCount = ref(0);
const streamCharTotal = ref(0);
const streamTickCount = ref(0);
const streamRound = ref(1);
const lastAction = ref(
  '点击“一键组合回归”，观察高底部状态区与流式输出同时存在时是否仍然稳定贴底。'
);
const streamProgressText = computed(() => {
  return `${emittedCharCount.value}/${streamCharTotal.value}`;
});
const bottomHeightModeLabel = computed(() => {
  return bottomHeightMode.value === 'fixed' ? 'fixed' : 'adaptive';
});
const bottomHeightLevel = computed(() => {
  if (bottomHeightMode.value === 'fixed') {
    return 3;
  }

  if (!isStreaming.value) {
    return bottomStatusMode.value === 'loading' ? 2 : 1;
  }

  const total = streamCharTotal.value || 1;
  const ratio = emittedCharCount.value / total;

  if (ratio < 0.34) {
    return 1;
  }

  if (ratio < 0.67) {
    return 2;
  }

  return 3;
});
let nextKey = 0;
let streamTimer: number | null = null;
let streamOffset = 0;
let streamCharacters: string[] = [];

const bottomStatus = computed<BubbleListBoundaryState | null>(() => {
  if (bottomStatusMode.value === 'loading') {
    return {
      type: 'loading',
      text: isStreaming.value
        ? `流式输出进行中，当前进度 ${streamProgressText.value}`
        : '正在加载更多消息，同时保留最后一条消息的完整可见区域。'
    };
  }

  if (bottomStatusMode.value === 'no-more') {
    return {
      type: 'no-more',
      text: '已经到底了，但最后一条消息底边仍然不应被底部状态区覆盖。'
    };
  }

  return null;
});

const bottomStatusLines = computed(() => {
  if (bottomStatusMode.value === 'none') {
    return [];
  }

  if (bottomStatusMode.value === 'no-more') {
    return bottomHeightMode.value === 'fixed'
      ? [
          '固定高度状态区仍然保留额外空间。',
          '最后一条消息底边依然不应被这个区域吞掉。'
        ]
      : ['自适应高度状态区已经收缩。', '最后一条消息仍然应该完整可见。'];
  }

  const lines = [
    bottomHeightMode.value === 'fixed'
      ? '固定高度：无论内容多少，底部状态区都保持较高占位。'
      : '自适应高度：底部状态区会随着内容多少自然增减高度。'
  ];

  if (isStreaming.value) {
    lines.push(
      `流式进度 ${streamProgressText.value}，chunk ${streamTickCount.value}`
    );
  }

  if (bottomHeightLevel.value >= 2) {
    lines.push('这一行会在自适应模式下按流式进度出现，用来制造真实高度变化。');
  }

  if (bottomHeightLevel.value >= 3) {
    lines.push(
      '如果底部高度补偿或流式跟随失效，最后一条消息底边就会被当前状态区盖住。'
    );
  }

  return lines;
});

function buildStreamingCharacters(currentRound: number) {
  const paragraphs = Array.from({ length: 72 }, (_, index) => {
    return `第${currentRound}轮第${index + 1}段流式内容：底部状态区此时正在占位，不管它是固定高度还是自适应高度，最后一条 AI 消息都应该继续稳定贴底并保持完整可见。`;
  });

  return Array.from(paragraphs.join(''));
}

function buildSeedList(source?: MessageItem[]) {
  const list = createStorySeed(
    source && source.length > 0 ? source : undefined,
    12,
    '底部状态回归'
  );

  nextKey = getLastMessageKey(list);
  bottomStatusMode.value = 'none';
  bottomHeightMode.value = 'adaptive';
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  isStreaming.value = false;
  emittedCharCount.value = 0;
  streamCharTotal.value = 0;
  streamTickCount.value = 0;
  streamRound.value = 1;
  lastAction.value =
    '点击“一键组合回归”，观察高底部状态区与流式输出同时存在时是否仍然稳定贴底。';
  streamCharacters = [];
  streamOffset = 0;

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

function stopStreaming(
  reason = '已停止流式输出。',
  nextMode: BottomStatusMode = bottomStatusMode.value
) {
  if (streamTimer !== null) {
    window.clearInterval(streamTimer);
    streamTimer = null;
  }

  isStreaming.value = false;
  bottomStatusMode.value = nextMode;
  lastAction.value = reason;
}

function startStreamingRegression() {
  if (isStreaming.value) {
    return;
  }

  const currentRound = streamRound.value;
  streamRound.value += 1;
  emittedCharCount.value = 0;
  streamCharTotal.value = 0;
  streamTickCount.value = 0;
  streamOffset = 0;
  bottomStatusMode.value = 'loading';

  bubbleItems.value.push(
    createStoryMessage(
      ++nextKey,
      'user',
      `第 ${currentRound} 轮回归请求：请验证底部状态区高度变化不会影响流式输出的自动贴底。`
    )
  );

  streamCharacters = buildStreamingCharacters(currentRound);
  streamCharTotal.value = streamCharacters.length;

  const initialChunk = streamCharacters
    .slice(0, STREAM_CHARS_PER_TICK)
    .join('');
  streamOffset = initialChunk.length;
  emittedCharCount.value = streamOffset;
  streamTickCount.value = initialChunk ? 1 : 0;

  bubbleItems.value.push(createStoryMessage(++nextKey, 'ai', initialChunk));
  isStreaming.value = true;
  lastAction.value =
    '流式回归已开始：此时可以来回切换固定高度和自适应高度，观察是否始终贴底。';

  nextTick(() => {
    bubbleListRef.value?.scrollToBottom(false);
  });

  streamTimer = window.setInterval(() => {
    const currentItem = bubbleItems.value[bubbleItems.value.length - 1];

    if (!currentItem || currentItem.role !== 'ai') {
      stopStreaming('流式消息已丢失，已终止当前回归。');
      return;
    }

    if (streamOffset >= streamCharacters.length) {
      stopStreaming('流式输出完成，底部状态已切换为 no-more。', 'no-more');
      return;
    }

    const nextChunk = streamCharacters
      .slice(streamOffset, streamOffset + STREAM_CHARS_PER_TICK)
      .join('');

    if (!nextChunk) {
      stopStreaming('流式输出完成，底部状态已切换为 no-more。', 'no-more');
      return;
    }

    currentItem.content += nextChunk;
    streamOffset += nextChunk.length;
    emittedCharCount.value = streamOffset;
    streamTickCount.value += 1;

    if (streamOffset >= streamCharacters.length) {
      stopStreaming('流式输出完成，底部状态已切换为 no-more。', 'no-more');
    }
  }, STREAM_TICK_MS);
}

function runRegressionStep() {
  bottomHeightMode.value = 'adaptive';
  startStreamingRegression();
}

function useAdaptiveHeight() {
  bottomHeightMode.value = 'adaptive';
  lastAction.value = isStreaming.value
    ? '已切到自适应高度：请继续观察流式消息是否仍然稳定贴底。'
    : '已切到底部状态区自适应高度模式。';
}

function useFixedHeight() {
  bottomHeightMode.value = 'fixed';
  lastAction.value = isStreaming.value
    ? '已切到固定高度：请继续观察流式消息是否仍然稳定贴底。'
    : '已切到底部状态区固定高度模式。';
}

function showLoadingStatus() {
  bottomStatusMode.value = 'loading';
  lastAction.value = '已显示较高的 loading 底部状态区。';
}

function showNoMoreStatus() {
  bottomStatusMode.value = 'no-more';
  lastAction.value = '已显示较高的 no-more 底部状态区。';
}

function clearBottomStatus() {
  bottomStatusMode.value = 'none';
  lastAction.value = '已清空底部状态区。';
}

function appendShortMessage() {
  bubbleItems.value.push(
    createStoryMessage(
      ++nextKey,
      'ai',
      '短消息：此时如果仍在底部，应该继续完整贴底，而不是被底部状态区遮住。'
    )
  );
  lastAction.value = '已追加短消息。';
}

function appendLongMessage() {
  bubbleItems.value.push(
    createStoryMessage(
      ++nextKey,
      'ai',
      '长消息：这里故意把消息内容拉长，用来验证最后一条消息在出现更高的底部状态区后，仍然会把真实底边滚进可视区域，而不是只滚到状态区上沿附近。'.repeat(
        2
      )
    )
  );
  lastAction.value = '已追加长消息。';
}

function forceToBottom() {
  bubbleListRef.value?.scrollToBottom(false);
  lastAction.value = '已强制回到底部。';
}

function handleScrollStateChange(state: BubbleListScrollState) {
  scrollState.value = state;
}

function handleUnreadCountChange(count: number) {
  unreadCount.value = count;
}

watch(
  () => props.list,
  source => {
    resetConversation(source as MessageItem[] | undefined);
  },
  { immediate: true }
);

onUnmounted(() => {
  stopStreaming(
    '组件卸载，已清理组合回归中的流式定时器。',
    bottomStatusMode.value
  );
});
</script>

<template>
  <div class="demo-shell">
    <div class="demo-head">
      <div class="demo-title">触底边界回归 / 底部状态区 + 流式输出</div>
      <p class="demo-caption">
        这个 story
        只验证一个组合回归点：高底部状态区与流式输出同时存在时，最后一条 AI
        消息仍然要稳定贴底。
      </p>
    </div>

    <div class="toolbar-group">
      <div class="btn-list">
        <el-button size="small" type="warning" plain @click="runRegressionStep">
          一键组合回归
        </el-button>
        <el-button
          size="small"
          type="warning"
          plain
          :disabled="isStreaming"
          @click="startStreamingRegression"
        >
          开始流式输出
        </el-button>
        <el-button
          size="small"
          type="danger"
          plain
          :disabled="!isStreaming"
          @click="stopStreaming('已手动停止流式输出。', bottomStatusMode)"
        >
          停止流式输出
        </el-button>
        <el-button
          size="small"
          type="primary"
          plain
          @click="appendShortMessage"
        >
          追加短消息
        </el-button>
        <el-button size="small" type="primary" plain @click="appendLongMessage">
          追加长消息
        </el-button>
      </div>

      <div class="btn-list">
        <el-button size="small" type="success" plain @click="useAdaptiveHeight">
          自适应高度
        </el-button>
        <el-button size="small" type="success" plain @click="useFixedHeight">
          固定高度
        </el-button>
        <el-button size="small" type="success" plain @click="showLoadingStatus">
          显示 loading 状态
        </el-button>
        <el-button size="small" type="success" plain @click="showNoMoreStatus">
          显示 no-more 状态
        </el-button>
        <el-button size="small" type="info" plain @click="clearBottomStatus">
          清空底部状态
        </el-button>
        <el-button size="small" type="info" plain @click="forceToBottom">
          强制回底
        </el-button>
        <el-button size="small" @click="handleReset"> 重置数据 </el-button>
      </div>
    </div>

    <div class="status-row">
      <div class="status-chip">
        <span>滚动状态</span>
        <strong>{{ scrollState }}</strong>
      </div>
      <div class="status-chip">
        <span>未读计数</span>
        <strong>{{ unreadCount }}</strong>
      </div>
      <div class="status-chip">
        <span>底部状态</span>
        <strong>{{ bottomStatusMode }}</strong>
      </div>
      <div class="status-chip">
        <span>高度模式</span>
        <strong>{{ bottomHeightModeLabel }}</strong>
      </div>
      <div class="status-chip">
        <span>流式状态</span>
        <strong>{{ isStreaming ? 'streaming' : 'idle' }}</strong>
      </div>
      <div class="status-chip">
        <span>输出进度</span>
        <strong>{{ streamProgressText }}</strong>
      </div>
      <div class="status-chip">
        <span>消息总数</span>
        <strong>{{ bubbleItems.length }}</strong>
      </div>
    </div>

    <div class="activity-bar">
      <span>最近动作</span>
      <strong>{{ lastAction }}</strong>
    </div>

    <div class="story-stage">
      <BubbleList
        v-bind="props"
        ref="bubbleListRef"
        :list="bubbleItems"
        :bottom-status="bottomStatus"
        :always-show-scrollbar="props.alwaysShowScrollbar ?? true"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <template #bottomStatus="{ status }">
          <div
            class="regression-bottom-status"
            :class="{
              'regression-bottom-status--fixed': bottomHeightMode === 'fixed'
            }"
            :data-state="status.type"
          >
            <span class="regression-bottom-status__badge">{{
              status.type
            }}</span>
            <div class="regression-bottom-status__text">
              <strong>底部状态区 + 流式输出联动回归</strong>
              <span v-for="line in bottomStatusLines" :key="line">{{
                line
              }}</span>
            </div>
          </div>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.demo-shell {
  display: grid;
  grid-template-rows: auto auto auto auto minmax(0, 1fr);
  gap: 10px;
  height: min(720px, calc(100vh - 16px));
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.demo-head {
  min-height: 0;
}

.demo-caption {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.45;
}

.demo-title,
.activity-bar strong {
  color: #1e3a8a;
  font-weight: 700;
  font-size: 16px;
}

.toolbar-group {
  display: grid;
  gap: 8px;
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
  gap: 8px;
  min-height: 34px;
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
    font-size: 14px;
    color: #0f172a;
    line-height: 1;
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
}

.story-stage {
  min-height: 0;
  height: 100%;
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

.regression-bottom-status {
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
  max-width: min(100%, 520px);
  min-height: 68px;
  padding: 10px 14px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(148, 163, 184, 0.26);
  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.08);
  text-align: left;

  &[data-state='loading'] {
    color: #1d4ed8;
  }

  &[data-state='no-more'] {
    color: #475569;
  }
}

.regression-bottom-status--fixed {
  min-height: 104px;
}

.regression-bottom-status__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: currentColor;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  flex-shrink: 0;
}

.regression-bottom-status__text {
  display: flex;
  flex-direction: column;
  gap: 4px;
  line-height: 1.45;

  strong {
    font-size: 13px;
  }

  span {
    font-size: 12px;
  }
}
</style>
