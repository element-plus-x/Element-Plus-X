<docs>
---
title: "Extreme Scenario: Dynamic Slot Heights and Auto-Follow Stress Test"
---

::: warning Purpose
This demo covers a more aggressive combination: `Thinking` components are rendered in `#header`, `#topStatus`, and `#item`. They grow while streaming and collapse automatically when the thinking phase ends.

Use it to verify whether `BubbleList` still follows the bottom when non-content areas change height during full-replace SSE streaming.
:::

Suggested checks:
1. Turn virtual list off and keep full replacement mode enabled
2. Enable or disable `#header`, `#topStatus`, and `#item` stress switches independently
3. Set speed to 10 and confirm the list remains at the bottom until the user scrolls up manually
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
  name: 'SseExtremeEnEchartsBlock',
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
      } catch (error) {
        console.warn(
          '[streaming-replace-sse-extreme-en] echarts init failed',
          error
        );
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

    return h('div', { class: 'chart-loading' }, 'Chart data is loading...');
  }
};

const CF = '```';

const LONG_THINKING_DETAIL = Array.from({ length: 34 }, (_, index) => {
  const district = [
    'Qingxiu',
    'Xingning',
    'Jiangnan',
    'Xixiangtang',
    'Liangqing',
    'Yongning'
  ][index % 6];
  const factor = ['PM2.5', 'PM10', 'NO2', 'O3', 'CODMn', 'NH3-N'][index % 6];
  const risk = ['low', 'medium', 'medium-high', 'high'][index % 4];

  return [
    `Reasoning fragment ${index + 1}: checking ${factor} values for ${district}.`,
    `- Temporary samples: ${128 + index * 19}`,
    `- Abnormal sites: ${(index % 5) + 1}`,
    `- Risk level: ${risk}`,
    '- Stress note: this block raises the height of the header, top status, and custom item slots.'
  ].join('\n');
}).join('\n\n');

const TOP_STATUS_THINKING_DETAIL = Array.from({ length: 14 }, (_, index) => {
  return `Top status stress ${index + 1}: simulating a dynamic boundary area while monitoring context is synchronized.`;
}).join('\n\n');

const ITEM_SLOT_THINKING_DETAIL = Array.from({ length: 16 }, (_, index) => {
  return `Custom item stress ${index + 1}: this non-bubble node is rendered through the #item slot and collapses after thinking ends.`;
}).join('\n\n');

const FINAL_FULL_CONTENT = `<think>
Understanding the request. This stress case checks whether BubbleList keeps following the bottom when several slot regions change height at the same time.

Step 1: Render Thinking in the Bubble #header slot.
Step 2: Render Thinking in BubbleList #topStatus.
Step 3: Insert an itemType=stress-thinking node rendered through #item.
Step 4: Continue streaming Markdown content with a table, ECharts, Mermaid, formula, and image.

${LONG_THINKING_DETAIL}

Ready to stream the final answer.</think>

## Extreme SSE Output Report

### Stress Matrix

| Slot | Dynamic Component | Height Source | Expected Behavior |
|:-----|:------------------|:--------------|:------------------|
| #header | Thinking | Streaming growth + auto-collapse | Do not break bottom following |
| #topStatus | Thinking | Dynamic boundary height | Do not misread as user scroll-up |
| #item | Thinking | Dynamic custom node height | Do not block later streaming follow |
| #content | MarkdownRenderer | Async table / chart / formula / image rendering | Keep following bottom |

### Site Distribution Chart

${CF}my-echarts
{
  "title": { "text": "Extreme Scenario Site Distribution", "left": "center" },
  "tooltip": { "trigger": "item", "formatter": "{b}: {c} sites ({d}%)" },
  "legend": { "bottom": "0" },
  "series": [{
    "type": "pie",
    "radius": ["42%", "72%"],
    "data": [
      { "value": 22, "name": "Air" },
      { "value": 51, "name": "Water" },
      { "value": 92, "name": "Straw Burning" },
      { "value": 10, "name": "Acid Rain" }
    ]
  }]
}
${CF}

### Dynamic Height Flow

${CF}mermaid
flowchart TD
  A[SSE full replacement] --> B[AI item content update]
  B --> C[#header Thinking grows]
  B --> D[#item Thinking grows]
  B --> E[Markdown content grows]
  B --> F[#topStatus Thinking grows]
  C --> G{Still following bottom?}
  D --> G
  E --> G
  F --> G
  G -->|Yes| H[Keep auto-following]
  G -->|No| I[Preserve user reading position]
${CF}

### AQI Formula

$$AQI = \\frac{I_{hi} - I_{lo}}{C_{hi} - C_{lo}} \\times (C_p - C_{lo}) + I_{lo}$$

### Image

![Environmental monitoring scene](https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80)

### Long Conclusion

${Array.from({ length: 14 }, (_, index) => `**Conclusion ${index + 1}**: This case changes the height of header, topStatus, item, and content regions together. As long as the user does not scroll up manually, BubbleList should stay AT_BOTTOM; once the user scrolls up, it should remain SCROLLED_UP and preserve the reading position.`).join('\n\n')}
`;

interface SSEEvent {
  content: string;
  completed: boolean;
}

function createMockSSE(
  finalContent: string,
  options: {
    onMessage: (event: SSEEvent) => void;
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
  for (let index = bubbleItems.value.length - 1; index >= 0; index--) {
    const item = bubbleItems.value[index];
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

  return { type: 'loading', text: 'Dynamic top status stress area' };
});

const topStatusThinkingContent = computed(() => {
  if (currentStreamingThink.value.status === 'thinking') {
    return [
      'BubbleList #topStatus dynamic height stress test.',
      TOP_STATUS_THINKING_DETAIL,
      currentStreamingThink.value.thinking
    ].join('\n\n');
  }

  return [
    'BubbleList #topStatus dynamic height stress test.',
    TOP_STATUS_THINKING_DETAIL
  ].join('\n\n');
});

const itemSlotThinkingContent = computed(() => {
  if (currentStreamingThink.value.status === 'thinking') {
    return [
      'BubbleList #item dynamic height stress test.',
      ITEM_SLOT_THINKING_DETAIL,
      currentStreamingThink.value.thinking
    ].join('\n\n');
  }

  return [
    'BubbleList #item dynamic height stress test.',
    ITEM_SLOT_THINKING_DETAIL
  ].join('\n\n');
});

function speedToTiming(speedValue: number) {
  const tickMs = Math.round(200 - (speedValue - 1) * 20);
  const charsPerTick = Math.round(2 + (speedValue - 1) * 6);
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
  for (let index = 0; index < 6; index++) {
    const role = index % 2 === 0 ? 'ai' : 'user';
    bubbleItems.value.push(
      createMessage(
        ++nextKey,
        role,
        role === 'ai'
          ? `Warm-up message ${index + 1}: fills the list close to the bottom.`
          : `User warm-up message ${index + 1}`
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
    createMessage(
      ++nextKey,
      'user',
      'Stress-test SSE auto-follow with dynamic slot heights.'
    )
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
    onMessage: event => {
      eventCount.value += 1;
      lastEventLength.value = event.content.length;
      const aiItem = latestAiItem.value;
      if (!aiItem) return;

      if (mode.value === 'replace') {
        aiItem.content = event.content;
      } else {
        const delta = event.content.slice(lastReceivedContent.length);
        aiItem.content += delta;
      }
      lastReceivedContent = event.content;
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

function handleScrollStateChange(state: BubbleListScrollState) {
  scrollState.value = state;
}

function handleUnreadCountChange(count: number) {
  unreadCount.value = count;
}

onMounted(buildSeed);
onUnmounted(stopStreaming);
</script>

<template>
  <div class="sse-extreme-demo">
    <div class="tip">
      <strong>Extreme scenario:</strong>
      <span :class="`mode-tag mode-${mode}`">
        {{ mode === 'replace' ? 'Full replacement' : 'Delta append' }}
      </span>
      <span class="hint">
        Stress-test #header, #topStatus, #item, and Markdown content height
        changes together.
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
        Start extreme SSE
      </el-button>
      <el-button
        size="small"
        type="warning"
        plain
        :disabled="!isStreaming"
        @click="stopStreaming"
      >
        Stop
      </el-button>
      <el-button
        size="small"
        type="info"
        plain
        :disabled="isStreaming"
        @click="toggleMode"
      >
        Switch to {{ mode === 'replace' ? 'delta append' : 'full replacement' }}
      </el-button>
      <el-button size="small" type="danger" plain @click="resetConversation">
        Reset
      </el-button>
      <div class="speed-control">
        <span class="speed-label">Speed</span>
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
          speed <= 3 ? 'Slow' : speed >= 8 ? 'Fast' : 'Medium'
        }}</span>
      </div>
    </div>

    <div class="switch-row">
      <div class="chip switch-chip">
        Virtual:
        <el-switch
          v-model="virtualEnabled"
          size="small"
          :disabled="isStreaming"
          inline-prompt
          active-text="On"
          inactive-text="Off"
        />
      </div>
      <div class="chip switch-chip">
        #header Thinking:
        <el-switch
          v-model="headerStressEnabled"
          size="small"
          :disabled="isStreaming"
          inline-prompt
          active-text="On"
          inactive-text="Off"
        />
      </div>
      <div class="chip switch-chip">
        #topStatus Thinking:
        <el-switch
          v-model="topStatusStressEnabled"
          size="small"
          :disabled="isStreaming"
          inline-prompt
          active-text="On"
          inactive-text="Off"
        />
      </div>
      <div class="chip switch-chip">
        #item Thinking:
        <el-switch
          v-model="itemStressEnabled"
          size="small"
          :disabled="isStreaming"
          inline-prompt
          active-text="On"
          inactive-text="Off"
        />
      </div>
    </div>

    <div class="status-row">
      <div class="chip">
        Scroll state:<strong :class="`s-${scrollState.toLowerCase()}`">{{
          scrollState
        }}</strong>
      </div>
      <div class="chip">
        Unread:<strong>{{ unreadCount }}</strong>
      </div>
      <div class="chip">
        SSE events:<strong>{{ eventCount }}</strong>
      </div>
      <div class="chip">
        Last content length:<strong>{{ lastEventLength }}</strong>
      </div>
      <div class="chip">
        Stream:<strong>{{ isStreaming ? 'running' : 'idle' }}</strong>
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
              >Waiting for reply...</span
            >
          </template>
          <template v-else>
            <span class="user-msg-text">{{ item.content }}</span>
          </template>
        </template>

        <template #item="{ item }">
          <div v-if="item.itemType === 'stress-thinking'" class="item-stress">
            <div class="item-stress-title">#item dynamic height node</div>
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
