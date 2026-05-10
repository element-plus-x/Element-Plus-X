<docs>
---
title: 模拟真实 SSE（全量累计）复现自动触底失效
---

::: warning 复现目的
某些后端为了简化前端处理，会把每次 SSE 事件的 `data.content` 设计为**已拼接好的累计全量内容**，前端只需在每次 `onmessage` 里把最后一次的 `content` 直接 **赋值（替换）** 到 AI 气泡上即可，无需自己拼接。

这种「全量替换」模式与示例库里常见的「增量追加（`content += chunk`）」模式行为非常接近，但在某些情况下会导致 `BubbleList` 的自动触底/流式跟随失效。这个 demo 用来稳定复现该问题。
:::

**关键差异**：
- 常规 demo：`currentItem.content += chunk`（字符串原地变长）
- 本 demo：`currentItem.content = latestSSEEvent.content`（每次都替换为新的完整字符串）

操作步骤：
1. 点击「开始模拟 SSE 流」
2. 观察 AI 气泡内容持续变长 —— **预期**：列表始终贴底；**实际**：列表停在初始位置，不会跟随
3. 如需对比，可点击「切换到增量追加模式」再试一次
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
    // 思考进行中：还没看到闭合标签，全部内容都是思考
    return {
      thinking: raw.slice(open + 7),
      body: '',
      status: 'thinking'
    };
  }
  const thinking = raw.slice(open + 7, close);
  const body = (raw.slice(0, open) + raw.slice(close + 8)).replace(
    /^\s+/,
    ''
  );
  return { thinking, body, status: 'end' };
}

// ============== 异步加载 MarkdownRenderer ==============
const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value = mod.MarkdownRenderer ?? mod.default ?? mod;
});

// ============== 模拟后端：构造一段足够长的「最终全量内容」 ==============
// 取自真实接口 case：包含 <think>、多个 ```table、长段总结，能稳定撑出滚动条
const FINAL_FULL_CONTENT
  = `<think>正在理解问题中……用户希望查询南宁市及其下属区县的环境监测站点统计数据。\n\n第一步：识别意图，这是一个站点数量查询任务。\n第二步：选择智能体，已选择「通用站点查询智能体」处理本次请求。\n第三步：调用监测站点检索 API，按城市/区县/站点类型多维聚合。\n第四步：汇总数据并按类型归类输出。\n\n准备就绪，开始组织最终回答……</think>\n\n`
  + Array.from({ length: 40 }, (_, i) => {
    return `**第 ${i + 1} 段累计输出**：南宁市及其下属区县共有 175 个环境监测站点，涵盖大气、水质、酸雨和秸秆焚烧等监测类型。大气监测站点 22 个；水质监测站点 51 个（地表水手动站 18、地表水自动站 18、饮用水手动站 15）；秸秆焚烧监测站点 92 个；酸雨监测站点 10 个。各类站点已按监测类型分类统计，具体数量分布情况见数据表格。\n\n`;
  }).join('');

// ============== 模拟后端 SSE：每次推送都是「拼接好的全量内容」 ==============
type SSEEvent = { content: string; completed: boolean };

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
    const accumulated = finalContent.slice(0, offset); // 关键：每次发出的是「累计后的完整字符串」
    const done = offset >= finalContent.length;
    onMessage({ content: accumulated, completed: done });
    if (done) {
      window.clearInterval(timer);
      onClose();
    }
  }, tickMs);
  return () => window.clearInterval(timer);
}

// ============== 组件状态 ==============
const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<MessageItem[]>([]);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const isStreaming = ref(false);
const mode = ref<'replace' | 'append'>('replace');
const lastEventLength = ref(0);
const eventCount = ref(0);

// 速度档位 1~10（1 最慢，10 最快）
const speed = ref(4);
function speedToTiming(s: number) {
  // tickMs: 200ms (s=1) -> 20ms (s=10)
  // charsPerTick: 2 (s=1) -> 56 (s=10)
  const tickMs = Math.round(200 - (s - 1) * 20);
  const charsPerTick = Math.round(2 + (s - 1) * 6);
  return { tickMs, charsPerTick };
}

let nextKey = 0;
let stopSSE: (() => void) | null = null;

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

function buildSeed() {
  bubbleItems.value = [];
  for (let i = 0; i < 6; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user';
    bubbleItems.value.push(
      createMessage(
        ++nextKey,
        role,
        role === 'ai'
          ? `预热消息 ${i + 1}：用于把列表填到接近底部的状态。`
          : `用户预热消息 ${i + 1}`
      )
    );
  }
  scrollState.value = 'AT_BOTTOM';
  unreadCount.value = 0;
  eventCount.value = 0;
  lastEventLength.value = 0;
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

  // 用户消息
  bubbleItems.value.push(
    createMessage(++nextKey, 'user', '请用 SSE 流式输出南宁市监测站点统计。')
  );

  // AI 占位消息（content 初始为空）
  bubbleItems.value.push(createMessage(++nextKey, 'ai', ''));

  isStreaming.value = true;
  eventCount.value = 0;
  let lastReceivedContent = ''; // 用于 append 模式计算 delta

  const { tickMs, charsPerTick } = speedToTiming(speed.value);
  stopSSE = createMockSSE(FINAL_FULL_CONTENT, {
    tickMs,
    charsPerTick,
    onMessage: (e) => {
      eventCount.value += 1;
      lastEventLength.value = e.content.length;
      const aiItem = bubbleItems.value[bubbleItems.value.length - 1];
      if (!aiItem || aiItem.role !== 'ai') return;

      if (mode.value === 'replace') {
        // ❗ 复现模式：每次 SSE 都是「全量累计内容」，前端直接整体替换
        aiItem.content = e.content;
      }
      else {
        // 对照模式：按 delta 增量追加（这才是 demo 库默认演示的方式）
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
  nextKey = 0;
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
  <div class="sse-replace-demo">
    <div class="tip">
      <strong>当前接收模式：</strong>
      <span :class="`mode-tag mode-${mode}`">
        {{ mode === 'replace' ? '全量替换（复现 Bug）' : '增量追加（正常）' }}
      </span>
      <span class="hint">
        全量替换模式下，预期 BubbleList 应当持续贴底，但实际可能不会自动滚动。
      </span>
    </div>

    <div class="toolbar">
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
          style="width: 180px"
        />
        <span class="speed-hint">{{
          speed <= 3 ? '慢（看清过程）' : speed >= 8 ? '快（接近真实）' : '中'
        }}</span>
      </div>
    </div>

    <div class="status-row">
      <div class="chip">
        滚动状态：<strong :class="`s-${scrollState.toLowerCase()}`">{{
          scrollState
        }}</strong>
      </div>
      <div class="chip">
        未读：<strong>{{ unreadCount }}</strong>
      </div>
      <div class="chip">
        SSE 事件数：<strong>{{ eventCount }}</strong>
      </div>
      <div class="chip">
        最后事件 content 长度：<strong>{{ lastEventLength }}</strong>
      </div>
      <div class="chip">
        流式状态：<strong>{{ isStreaming ? '进行中' : '空闲' }}</strong>
      </div>
    </div>

    <div class="stage">
      <BubbleList
        ref="bubbleListRef"
        :list="bubbleItems"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <template #content="{ item }">
          <template v-if="item.role === 'ai'">
            <!-- 思考过程：放在气泡 body 内，Markdown 正文上方；
                 思考结束后 autoCollapse 自动折叠 -->
            <Thinking
              v-if="parseThink(item.content).thinking || parseThink(item.content).status === 'thinking'"
              :content="parseThink(item.content).thinking"
              :status="
                parseThink(item.content).status === 'thinking'
                  ? 'thinking'
                  : 'end'
              "
              auto-collapse
              max-width="100%"
              style="margin-bottom: 8px"
            />
            <!-- 正文：用 Markdown 渲染 -->
            <component
              :is="MarkdownRenderer"
              v-if="MarkdownRenderer && parseThink(item.content).body"
              :markdown="parseThink(item.content).body"
              :enable-animate="isStreaming"
            />
            <span
              v-else-if="
                !parseThink(item.content).body
                  && parseThink(item.content).status !== 'thinking'
              "
              style="color: #999"
            >正在等待回复...</span>
          </template>
          <template v-else>
            <span>{{ item.content }}</span>
          </template>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sse-replace-demo {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
}
.tip {
  padding: 12px 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%);
  border: 1px solid #fde68a;
  font-size: 13px;
  color: #92400e;
  line-height: 1.7;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.mode-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-weight: 600;
  &.mode-replace {
    background: #fecaca;
    color: #991b1b;
  }
  &.mode-append {
    background: #bbf7d0;
    color: #166534;
  }
}
.hint {
  color: #78350f;
  font-size: 12px;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.speed-control {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: 8px;
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
  min-width: 64px;
}
.status-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #e2e8f0;
  font-size: 12px;
  color: #64748b;
  strong {
    color: #0f172a;
    font-size: 13px;
    &.s-at_bottom {
      color: #16a34a;
    }
    &.s-scrolled_up {
      color: #d97706;
    }
    &.s-has_new_messages {
      color: #dc2626;
    }
  }
}
.stage {
  min-height: 520px;
  height: 520px;
  padding: 10px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  display: flex;
}
.stage :deep(.elx-bubble-list) {
  width: 100%;
  height: 100%;
  flex: 1 1 0;
  min-height: 0;
  overflow: hidden;
}
</style>
