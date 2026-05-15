<docs>
---
title: 极端场景：动态插槽高度与自动触底压力测试
---

::: warning 复现目的
这个 demo 用来覆盖更极端的组合场景：在 `#header`、`#topStatus`、`#item` 这些不同插槽里同时放入会随流式内容增高、并在思考结束后 `auto-collapse` 的 `Thinking` 组件。

用于观察：当多个非正文区域出现高度突变时，`BubbleList` 的自动触底是否仍然稳定，尤其是非虚拟列表模式和高速 SSE 全量替换模式。
:::

操作建议：
1. 关闭虚拟列表，保持「全量替换」模式，输出速度拉满
2. 依次打开/关闭 `#header`、`#topStatus`、`#item` 压力开关，观察滚动状态
3. 对比开启虚拟列表后的表现
</docs>

<script setup lang="ts">
import type {
  BubbleListBoundaryState,
  BubbleListInstance,
  BubbleListItemProps,
  BubbleListProps,
  BubbleListScrollState
} from 'vue-element-plus-x/types/BubbleList';
import {
  defineComponent,
  h,
  onBeforeUnmount as vOnBeforeUnmount,
  onMounted as vOnMounted,
  ref as vRef
} from 'vue';

interface MessageItem extends BubbleListItemProps {
  key: number;
  role: 'user' | 'ai' | 'system';
  placement: 'start' | 'end';
  content: string;
  avatar: string;
  itemType?: 'stress-thinking';
}

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

const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;

  // @ts-expect-error style entry is runtime-only in x-markdown-vue
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value =
    (mod as any).MarkdownRenderer ?? (mod as any).default ?? mod;
});

const MyEchartsBlock = defineComponent({
  name: 'SseExtremeEchartsBlock',
  props: {
    option: { type: Object, required: true }
  },
  setup(props) {
    const chartEl = vRef<HTMLDivElement>();
    let chart: any = null;
    let resizeObserver: ResizeObserver | null = null;

    vOnMounted(async () => {
      if (!chartEl.value) return;

      try {
        const echarts = await import('echarts');
        chart = echarts.init(chartEl.value);
        chart.setOption(props.option);
        resizeObserver = new ResizeObserver(() => chart?.resize());
        resizeObserver.observe(chartEl.value);
      } catch (e) {
        console.warn('[streaming-replace-sse-extreme] echarts init failed', e);
      }
    });

    vOnBeforeUnmount(() => {
      resizeObserver?.disconnect();
      chart?.dispose();
    });

    return () =>
      h('div', {
        ref: chartEl,
        style: 'width:100%;height:320px;margin:16px 0;'
      });
  }
});

function safeJsonParse(raw: string) {
  try {
    return { ok: true as const, value: JSON.parse(raw) };
  } catch {
    return { ok: false as const };
  }
}

const codeXRender = {
  'my-echarts': (props: any) => {
    const parsed = safeJsonParse(props.raw.content);
    if (parsed.ok) return h(MyEchartsBlock, { option: parsed.value });

    return h('div', { class: 'chart-loading' }, '图表数据加载中...');
  }
};

const CF = '```';

const LONG_THINKING_DETAIL = Array.from({ length: 36 }, (_, i) => {
  const area = ['青秀区', '兴宁区', '江南区', '西乡塘区', '良庆区', '邕宁区'][
    i % 6
  ];
  const factor = ['PM2.5', 'PM10', 'NO2', 'O3', 'CODMn', '氨氮'][i % 6];
  const risk = ['低', '中', '中高', '高'][i % 4];

  return [
    `推理片段 ${i + 1}：正在比对 ${area} 的 ${factor} 监测指标。`,
    `- 临时样本量：${128 + i * 19} 条`,
    `- 异常点位：${(i % 5) + 1} 个`,
    `- 风险等级：${risk}`,
    `- 处理策略：先按小时聚合，再按站点类型回填缺失值，最后校验累计总数是否仍为 175。`,
    `- 高度压力：这一段会同时影响 header / topStatus / item 插槽中的 Thinking 展开高度。`
  ].join('\n');
}).join('\n\n');

const TOP_STATUS_THINKING_DETAIL = Array.from({ length: 16 }, (_, i) => {
  return `顶部插槽压力 ${i + 1}：模拟顶部加载区中存在动态高度组件，当前正在同步第 ${i + 1} 批监测站点上下文。`;
}).join('\n\n');

const ITEM_SLOT_THINKING_DETAIL = Array.from({ length: 18 }, (_, i) => {
  return `#item 插槽压力 ${i + 1}：这是一个非 Bubble 节点，由 itemType 命中 #item 插槽渲染，并在思考结束后自动折叠。`;
}).join('\n\n');

const FINAL_FULL_CONTENT = `<think>
正在理解问题中……本次用于测试多个插槽共同产生动态高度变化时，BubbleList 是否仍能持续追底。

第一步：在 Bubble 的 #header 中渲染 Thinking。
第二步：在 BubbleList 的 #topStatus 中渲染 Thinking。
第三步：插入一个 itemType=stress-thinking 的非气泡节点，在 #item 中渲染 Thinking。
第四步：正文继续输出 Markdown 表格、ECharts、Mermaid、数学公式和图片。

${LONG_THINKING_DETAIL}

准备就绪，开始输出最终回答。</think>

## 极端场景 SSE 输出报告

### 一、压力场景矩阵

| 插槽位置 | 动态组件 | 高度变化来源 | 预期行为 |
|:---------|:---------|:-------------|:---------|
| #header | Thinking | 流式展开 + 自动折叠 | 不打断 AI 回复追底 |
| #topStatus | Thinking | 顶部边界区域动态高度 | 不误判用户上滑 |
| #item | Thinking | 非气泡节点动态高度 | 不阻断后续流式追底 |
| #content | MarkdownRenderer | 表格/图表/公式/图片异步渲染 | 持续贴底 |

### 二、站点类型分布（ECharts）

${CF}my-echarts
{
  "title": { "text": "极端场景站点分布", "left": "center" },
  "tooltip": { "trigger": "item", "formatter": "{b}: {c} 个 ({d}%)" },
  "legend": { "bottom": "0" },
  "series": [{
    "type": "pie",
    "radius": ["42%", "72%"],
    "data": [
      { "value": 22, "name": "大气监测" },
      { "value": 51, "name": "水质监测" },
      { "value": 92, "name": "秸秆焚烧" },
      { "value": 10, "name": "酸雨监测" }
    ]
  }]
}
${CF}

### 三、动态高度触发链路（Mermaid）

${CF}mermaid
flowchart TD
  A[SSE 全量替换] --> B[AI item content 更新]
  B --> C[#header Thinking 增高]
  B --> D[#item Thinking 增高]
  B --> E[Markdown 正文增高]
  B --> F[#topStatus Thinking 增高]
  C --> G{是否仍在底部}
  D --> G
  E --> G
  F --> G
  G -->|是| H[继续自动触底]
  G -->|否| I[保持用户阅读位置]
${CF}

### 四、AQI 公式

$$AQI = \\frac{I_{hi} - I_{lo}}{C_{hi} - C_{lo}} \\times (C_p - C_{lo}) + I_{lo}$$

### 五、图片

![生态监测示意图](https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80)

### 六、长段结论

${Array.from({ length: 14 }, (_, i) => `**结论段 ${i + 1}**：当前压力用例会同时让 header、topStatus、item 和 content 区域产生高度变化。理想情况下，只要用户没有主动上滑，BubbleList 都应该维持 AT_BOTTOM；一旦用户主动上滑，则应该进入 SCROLLED_UP 并停止追底。`).join('\n\n')}
`;

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
    const accumulated = finalContent.slice(0, offset);
    const done = offset >= finalContent.length;
    onMessage({ content: accumulated, completed: done });
    if (done) {
      window.clearInterval(timer);
      onClose();
    }
  }, tickMs);
  return () => window.clearInterval(timer);
}

const bubbleListRef = ref<BubbleListInstance | null>(null);
const bubbleItems = ref<BubbleListProps<MessageItem>['list']>([]);
const scrollState = ref<BubbleListScrollState>('AT_BOTTOM');
const unreadCount = ref(0);
const isStreaming = ref(false);
const hasStreamStarted = ref(false);
const mode = ref<'replace' | 'append'>('replace');
const lastEventLength = ref(0);
const eventCount = ref(0);
const virtualEnabled = ref(false);
const headerStressEnabled = ref(true);
const topStatusStressEnabled = ref(true);
const itemStressEnabled = ref(true);
const speed = ref(10);

let nextKey = 0;
let stopSSE: (() => void) | null = null;

const latestAiItem = computed(() => {
  for (let i = bubbleItems.value.length - 1; i >= 0; i--) {
    const item = bubbleItems.value[i];
    if (item?.role === 'ai') return item;
  }
  return undefined;
});

const currentStreamingThink = computed(() => {
  const item = latestAiItem.value;
  if (!item)
    return { thinking: '', body: '', status: 'start' as ThinkingStatus };

  return parseThink(item.content);
});

const topStatus = computed<BubbleListBoundaryState | null>(() => {
  if (!topStatusStressEnabled.value || !hasStreamStarted.value) return null;

  return { type: 'loading', text: '顶部动态 Thinking 压力区' };
});

const topStatusThinkingContent = computed(() => {
  if (currentStreamingThink.value.status === 'thinking') {
    return [
      'BubbleList #topStatus 动态高度压力测试。',
      TOP_STATUS_THINKING_DETAIL,
      currentStreamingThink.value.thinking
    ].join('\n\n');
  }

  return [
    'BubbleList #topStatus 动态高度压力测试。',
    TOP_STATUS_THINKING_DETAIL
  ].join('\n\n');
});

const itemSlotThinkingContent = computed(() => {
  if (currentStreamingThink.value.status === 'thinking') {
    return [
      'BubbleList #item 动态高度压力测试。',
      ITEM_SLOT_THINKING_DETAIL,
      currentStreamingThink.value.thinking
    ].join('\n\n');
  }

  return [
    'BubbleList #item 动态高度压力测试。',
    ITEM_SLOT_THINKING_DETAIL
  ].join('\n\n');
});

function speedToTiming(s: number) {
  const tickMs = Math.round(200 - (s - 1) * 20);
  const charsPerTick = Math.round(2 + (s - 1) * 6);
  return { tickMs, charsPerTick };
}

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
    variant: isUser ? 'outlined' : 'filled',
    noStyle: true
  };
}

function createStressItem(): MessageItem {
  return {
    key: ++nextKey,
    role: 'system',
    placement: 'start',
    content: '',
    avatar: '',
    itemType: 'stress-thinking',
    noStyle: true
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
  hasStreamStarted.value = false;
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
  hasStreamStarted.value = true;

  bubbleItems.value.push(
    createMessage(++nextKey, 'user', '请用极端插槽组合压测 SSE 自动触底能力。')
  );

  if (itemStressEnabled.value) bubbleItems.value.push(createStressItem());

  bubbleItems.value.push(createMessage(++nextKey, 'ai', ''));

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
      const aiItem = latestAiItem.value;
      if (!aiItem) return;

      if (mode.value === 'replace') {
        aiItem.content = e.content;
      } else {
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
  <div class="sse-extreme-demo">
    <div class="tip">
      <strong>极端场景：</strong>
      <span :class="`mode-tag mode-${mode}`">
        {{ mode === 'replace' ? '全量替换' : '增量追加' }}
      </span>
      <span class="hint">
        同时压测 #header、#topStatus、#item 与 Markdown 正文的动态高度变化。
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
        开始极端 SSE 流
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
          speed <= 3 ? '慢' : speed >= 8 ? '快（极端）' : '中'
        }}</span>
      </div>
    </div>

    <div class="switch-row">
      <div class="chip switch-chip">
        虚拟列表：
        <el-switch
          v-model="virtualEnabled"
          size="small"
          :disabled="isStreaming"
          inline-prompt
          active-text="开"
          inactive-text="关"
        />
      </div>
      <div class="chip switch-chip">
        #header Thinking：
        <el-switch
          v-model="headerStressEnabled"
          size="small"
          :disabled="isStreaming"
          inline-prompt
          active-text="开"
          inactive-text="关"
        />
      </div>
      <div class="chip switch-chip">
        #topStatus Thinking：
        <el-switch
          v-model="topStatusStressEnabled"
          size="small"
          :disabled="isStreaming"
          inline-prompt
          active-text="开"
          inactive-text="关"
        />
      </div>
      <div class="chip switch-chip">
        #item Thinking：
        <el-switch
          v-model="itemStressEnabled"
          size="small"
          :disabled="isStreaming"
          inline-prompt
          active-text="开"
          inactive-text="关"
        />
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
        :virtual="virtualEnabled"
        :top-status="topStatus"
        @scroll-state-change="handleScrollStateChange"
        @unread-count-change="handleUnreadCountChange"
      >
        <template #topStatus>
          <div class="top-status-stress">
            <Thinking
              :content="topStatusThinkingContent"
              :status="
                currentStreamingThink.status === 'thinking' ? 'thinking' : 'end'
              "
              auto-collapse
              max-width="100%"
            />
          </div>
        </template>

        <template #header="{ item }">
          <Thinking
            v-if="
              headerStressEnabled &&
              item.role === 'ai' &&
              (parseThink(item.content).thinking ||
                parseThink(item.content).status === 'thinking')
            "
            class="message-thinking"
            :content="parseThink(item.content).thinking"
            :status="
              parseThink(item.content).status === 'thinking'
                ? 'thinking'
                : 'end'
            "
            auto-collapse
            max-width="100%"
          />
        </template>

        <template #content="{ item }">
          <template v-if="item.role === 'ai'">
            <component
              :is="MarkdownRenderer"
              v-if="MarkdownRenderer && parseThink(item.content).body"
              :markdown="parseThink(item.content).body"
              :code-x-render="codeXRender"
              :enable-mermaid="true"
              :enable-animate="isStreaming"
            />
            <span
              v-else-if="
                !parseThink(item.content).body &&
                parseThink(item.content).status !== 'thinking'
              "
              class="waiting-text"
              >正在等待回复...</span
            >
          </template>
          <template v-else>
            <span class="user-msg-text">{{ item.content }}</span>
          </template>
        </template>

        <template #item="{ item }">
          <div v-if="item.itemType === 'stress-thinking'" class="item-stress">
            <div class="item-stress-title">#item 插槽动态高度节点</div>
            <Thinking
              :content="itemSlotThinkingContent"
              :status="
                currentStreamingThink.status === 'thinking' ? 'thinking' : 'end'
              "
              auto-collapse
              max-width="100%"
            />
          </div>
          <div v-else class="item-stress">
            {{ item.content }}
          </div>
        </template>
      </BubbleList>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sse-extreme-demo {
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
.toolbar,
.switch-row,
.status-row {
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
.switch-chip {
  padding-right: 8px;
}
.stage {
  min-height: 560px;
  height: 560px;
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
.top-status-stress {
  padding: 8px 12px 6px;
  border-bottom: 1px solid #dbeafe;
  background: #eff6ff;
}
.message-thinking {
  margin-bottom: 8px;
}
.item-stress {
  width: min(720px, calc(100% - 40px));
  margin: 8px auto;
  padding: 12px;
  border-radius: 10px;
  border: 1px dashed #cbd5e1;
  background: #fff;
}
.item-stress-title {
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}
.chart-loading {
  margin: 16px 0;
  padding: 12px;
  border: 1px dashed #dbeafe;
  border-radius: 8px;
  background: #f8fafc;
  color: #64748b;
  font-size: 13px;
}
.waiting-text {
  color: #999;
}
.user-msg-text {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 12px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  font-size: 14px;
  line-height: 1.5;
}
</style>
