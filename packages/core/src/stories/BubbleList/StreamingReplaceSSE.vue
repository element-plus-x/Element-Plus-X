<script setup lang="ts">
import type { MessageItem } from '@assets/mock';
import type {
  BubbleListInstance,
  BubbleListScrollState
} from '@components/BubbleList/types';
import { createStoryMessage, getLastMessageKey } from './story-utils';

const props = withDefaults(defineProps<Props>(), {
  autoScroll: true,
  virtual: true,
  maxHeight: 560,
  smoothScroll: true,
  alwaysShowScrollbar: true
});

// 这个 story 用于复现：后端 SSE 每次推送的是「已拼接好的全量内容」，
// 前端只取最后一次 content 并整体赋值到 AI 气泡时，BubbleList
// 的自动触底/流式跟随有概率失效。
//
// 与 StreamingFollow.vue 的区别：
//   - StreamingFollow.vue：currentItem.content += chunk  (delta append)
//   - 本 story：           currentItem.content = e.content (full replace)

// ============== 构造一段够长的「最终全量内容」 ==============
const FINAL_FULL_CONTENT = `<think>正在理解问题中……用户希望查询南宁市及其下属区县的环境监测站点统计数据。\n\n第一步：识别意图，这是一个站点数量查询任务。\n第二步：选择智能体，已选择「通用站点查询智能体」处理本次请求。\n第三步：调用监测站点检索 API，按城市/区县/站点类型多维聚合。\n第四步：汇总数据并按类型归类输出。\n\n准备就绪，开始组织最终回答……</think>\n\n${Array.from(
  { length: 40 },
  (_, i) => {
    return `**第 ${i + 1} 段累计输出**：南宁市及其下属区县共有 175 个环境监测站点，涵盖大气、水质、酸雨和秸秆焚烧等监测类型。大气监测站点 22 个；水质监测站点 51 个；秸秆焚烧监测站点 92 个；酸雨监测站点 10 个。各类站点已按监测类型分类统计。\n\n`;
  }
).join('')}`;

// ============== <think> 解析 ==============
type ThinkingStatus = 'start' | 'thinking' | 'end';
interface ParsedThink {
  thinking: string;
  body: string;
  status: ThinkingStatus;
}

function parseThink(raw: string): ParsedThink {
  if (!raw) return { thinking: '', body: '', status: 'start' };
  const open = raw.indexOf('<think>');
  if (open < 0) return { thinking: '', body: raw, status: 'start' };
  const close = raw.indexOf('</think>', open + 7);
  if (close < 0) {
    return {
      thinking: raw.slice(open + 7),
      body: '',
      status: 'thinking'
    };
  }
  const thinking = raw.slice(open + 7, close);
  const body = (raw.slice(0, open) + raw.slice(close + 8)).replace(/^\s+/, '');
  return { thinking, body, status: 'end' };
}

// ============== 异步加载 MarkdownRenderer ==============
const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value =
    (mod as any).MarkdownRenderer ?? (mod as any).default ?? mod;
});

// ============== Mock SSE：每次推送都是「累计后的全量字符串」 ==============
interface SSEEvent {
  content: string;
  completed: boolean;
}
function createMockSSE(
  finalContent: string,
  options: {
    onMessage: (e: SSEEvent) => void;
    onClose: () => void;
    tickMs?: number;
    charsPerTick?: number;
  }
) {
  const { onMessage, onClose, tickMs = 50, charsPerTick = 30 } = options;
  let offset = 0;
  const timer = window.setInterval(() => {
    offset = Math.min(offset + charsPerTick, finalContent.length);
    const done = offset >= finalContent.length;
    onMessage({ content: finalContent.slice(0, offset), completed: done });
    if (done) {
      window.clearInterval(timer);
      onClose();
    }
  }, tickMs);
  return () => window.clearInterval(timer);
}

// ============== Props（与其他 story 一致，透传给 BubbleList） ==============
interface Props {
  autoScroll?: boolean;
  virtual?: boolean;
  maxHeight?: number | string;
  smoothScroll?: boolean;
  alwaysShowScrollbar?: boolean;
}
const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<MessageItem[]>([]);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const isStreaming = ref(false);
const mode = ref<'replace' | 'append'>('replace');
const eventCount = ref(0);
const lastEventLength = ref(0);

// 速度档位 1~10（1 最慢，10 最快）
const speed = ref(4);
function speedToTiming(s: number) {
  const tickMs = Math.round(200 - (s - 1) * 20);
  const charsPerTick = Math.round(2 + (s - 1) * 6);
  return { tickMs, charsPerTick };
}

let nextKey = 0;
let stopSSE: (() => void) | null = null;

function buildSeed() {
  const seed: MessageItem[] = [];
  for (let i = 0; i < 6; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    seed.push(
      createStoryMessage(
        i + 1,
        role,
        role === 'ai'
          ? `预热消息 ${i + 1}：用于把列表填到接近底部的状态。`
          : `用户预热消息 ${i + 1}`
      )
    );
  }
  bubbleItems.value = seed;
  nextKey = getLastMessageKey(seed);
  eventCount.value = 0;
  lastEventLength.value = 0;
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  nextTick(() => bubbleListRef.value?.scrollToBottom(false));
}

function stopStreaming() {
  stopSSE?.();
  stopSSE = null;
  isStreaming.value = false;
}

function startStreaming() {
  if (isStreaming.value) return;
  stopStreaming();

  bubbleItems.value.push(
    createStoryMessage(
      ++nextKey,
      'user',
      '请用 SSE 流式输出南宁市监测站点统计。'
    )
  );
  bubbleItems.value.push(createStoryMessage(++nextKey, 'ai', ''));

  isStreaming.value = true;
  eventCount.value = 0;
  let lastReceivedContent = '';

  const { tickMs, charsPerTick } = speedToTiming(speed.value);
  stopSSE = createMockSSE(FINAL_FULL_CONTENT, {
    tickMs,
    charsPerTick,
    onMessage: e => {
      eventCount.value += 1;
      lastEventLength.value = e.content.length;
      const aiItem = bubbleItems.value[bubbleItems.value.length - 1];
      if (!aiItem || aiItem.role !== 'ai') return;

      if (mode.value === 'replace') {
        // 复现：直接整体替换
        aiItem.content = e.content;
      } else {
        // 对照：按 delta 增量追加
        const delta = e.content.slice(lastReceivedContent.length);
        aiItem.content += delta;
      }
      lastReceivedContent = e.content;
    },
    onClose: () => {
      isStreaming.value = false;
    }
  });
}

function resetConversation() {
  stopStreaming();
  buildSeed();
}

function toggleMode() {
  if (isStreaming.value) return;
  mode.value = mode.value === 'replace' ? 'append' : 'replace';
}

function handleScrollStateChange(s: BubbleListScrollState) {
  scrollState.value = s;
}
function handleUnreadCountChange(c: number) {
  unreadCount.value = c;
}

onMounted(buildSeed);
onUnmounted(stopStreaming);
</script>

<template>
  <div class="demo-shell" data-testid="streaming-replace-sse">
    <div class="demo-head">
      <div class="demo-title">SSE 全量替换 / 自动触底失效复现</div>
      <p class="demo-caption">
        模拟后端每次 SSE 事件都推送「累计好的完整 content」，前端直接整体赋值。
        与「增量追加」相比，此模式下 BubbleList 可能不会持续贴底。
      </p>
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
          开始模拟 SSE 流
        </el-button>
        <el-button
          size="small"
          type="warning"
          plain
          :disabled="!isStreaming"
          @click="stopStreaming"
        >
          停止
        </el-button>
        <el-button
          size="small"
          type="info"
          plain
          :disabled="isStreaming"
          @click="toggleMode"
        >
          切换为「{{ mode === 'replace' ? '增量追加' : '全量替换' }}」模式
        </el-button>
        <el-button size="small" type="danger" plain @click="resetConversation">
          重置会话
        </el-button>
        <div class="speed-control">
          <span class="speed-label">输出速度</span>
          <el-slider
            v-model="speed"
            :min="1"
            :max="10"
            :step="1"
            :disabled="isStreaming"
            show-stops
            style="width: 160px"
          />
          <span class="speed-hint">{{
            speed <= 3 ? '慢' : speed >= 8 ? '快' : '中'
          }}</span>
        </div>
      </div>
    </div>

    <div class="status-row">
      <div class="status-chip">
        <span>当前模式</span>
        <strong :class="`mode-${mode}`">{{
          mode === 'replace' ? '全量替换 (复现 Bug)' : '增量追加 (正常)'
        }}</strong>
      </div>
      <div class="status-chip">
        <span>滚动状态</span>
        <strong>{{ scrollState }}</strong>
      </div>
      <div class="status-chip">
        <span>未读计数</span>
        <strong>{{ unreadCount }}</strong>
      </div>
      <div class="status-chip">
        <span>SSE 事件数</span>
        <strong>{{ eventCount }}</strong>
      </div>
      <div class="status-chip">
        <span>最后 content 长度</span>
        <strong>{{ lastEventLength }}</strong>
      </div>
      <div class="status-chip">
        <span>流式状态</span>
        <strong>{{ isStreaming ? '进行中' : '空闲' }}</strong>
      </div>
    </div>

    <div class="story-stage">
      <BubbleList
        v-bind="props"
        ref="bubbleListRef"
        :list="bubbleItems"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <template #content="{ item }">
          <template v-if="(item as MessageItem).role === 'ai'">
            <Thinking
              v-if="
                parseThink((item as MessageItem).content ?? '').thinking ||
                parseThink((item as MessageItem).content ?? '').status ===
                  'thinking'
              "
              :content="
                parseThink((item as MessageItem).content ?? '').thinking
              "
              :status="
                parseThink((item as MessageItem).content ?? '').status ===
                'thinking'
                  ? 'thinking'
                  : 'end'
              "
              auto-collapse
              max-width="100%"
              style="margin-bottom: 8px"
            />
            <component
              :is="MarkdownRenderer"
              v-if="
                MarkdownRenderer &&
                parseThink((item as MessageItem).content ?? '').body
              "
              :markdown="parseThink((item as MessageItem).content ?? '').body"
              :enable-animate="isStreaming"
            />
            <span
              v-else-if="
                !parseThink((item as MessageItem).content ?? '').body &&
                parseThink((item as MessageItem).content ?? '').status !==
                  'thinking'
              "
              style="color: #999"
              >正在等待回复...</span
            >
          </template>
          <template v-else>
            <span>{{ (item as MessageItem).content }}</span>
          </template>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.demo-shell {
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr);
  gap: 10px;
  height: min(720px, calc(100vh - 16px));
  padding: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
.demo-title {
  color: #1e3a8a;
  font-weight: 700;
  font-size: 16px;
}
.demo-caption {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 13px;
  line-height: 1.45;
}
.btn-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.speed-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 4px;
  padding: 0 12px;
  height: 28px;
  border-radius: 999px;
  background: #f1f5f9;
}
.speed-label {
  font-size: 12px;
  color: #475569;
  font-weight: 600;
}
.speed-hint {
  font-size: 12px;
  color: #64748b;
  min-width: 24px;
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
    font-size: 13px;
    color: #0f172a;
    line-height: 1;
    &.mode-replace {
      color: #b91c1c;
    }
    &.mode-append {
      color: #15803d;
    }
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
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}
</style>
