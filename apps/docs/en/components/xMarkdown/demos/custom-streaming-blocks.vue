<docs>
---
title: Streaming Custom Code Blocks (with Skeleton Placeholder)
---

A real-world AI streaming scenario: while the JSON inside an \`el-table\` / \`el-form\` / \`my-echarts\` code block is still being assembled, show an **el-skeleton** placeholder; once the JSON becomes valid, swap to the actual component.

The trick: inside `code-x-render`, try `JSON.parse(props.raw.content)`. **Parse fails → skeleton; parse succeeds → real component.** Combined with streaming updates this naturally produces a "skeleton → content" transition.
</docs>

<script setup lang="ts">
import {
  ElForm,
  ElFormItem,
  ElInput,
  ElSkeleton,
  ElTable,
  ElTableColumn
} from 'element-plus';
import { defineComponent, h, onMounted as vOnMounted, ref as vRef } from 'vue';
import 'shiki';
import 'shiki-stream';

const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value = mod.MarkdownRenderer ?? mod.default ?? mod;
});

const fullText = `## Streaming Output Example

Each block below shows a skeleton while streaming and swaps to the real component once its JSON is complete:

\`\`\`el-table
{
  "columns": ["Name", "Role", "Department"],
  "rows": [
    { "Name": "Alice",   "Role": "Frontend Engineer", "Department": "R&D" },
    { "Name": "Bob",     "Role": "Product Manager",   "Department": "Product" },
    { "Name": "Charlie", "Role": "UI Designer",       "Department": "Design" }
  ]
}
\`\`\`

\`\`\`el-form
{
  "fields": [
    { "label": "Name",  "value": "Alice" },
    { "label": "Email", "value": "alice@example.com" },
    { "label": "Dept",  "value": "R&D" }
  ]
}
\`\`\`

\`\`\`my-echarts
{
  "title": { "text": "Quarterly Sales", "left": "center" },
  "tooltip": {},
  "xAxis": { "type": "category", "data": ["Q1","Q2","Q3","Q4"] },
  "yAxis": { "type": "value" },
  "series": [{ "type": "bar", "data": [120, 200, 150, 320], "itemStyle": { "borderRadius": 6 } }]
}
\`\`\`
`;

const streamContent = ref('');
let intervalId: ReturnType<typeof setInterval> | null = null;
const isStreaming = ref(false);

function startStream() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
  streamContent.value = '';
  isStreaming.value = true;
  let index = 0;
  intervalId = setInterval(() => {
    if (index < fullText.length) {
      const step = 4;
      streamContent.value += fullText.slice(index, index + step);
      index += step;
    } else {
      clearInterval(intervalId!);
      intervalId = null;
      isStreaming.value = false;
    }
  }, 40);
}

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

// ─── Real components ─────────────────────────────────────────────────────────
const ElTableBlock = defineComponent({
  name: 'ElTableBlock',
  props: { data: { type: Object, required: true } },
  setup(props) {
    return () =>
      h('div', { style: 'margin:16px 0;' }, [
        h(
          ElTable as any,
          {
            data: props.data.rows ?? [],
            border: true,
            stripe: true,
            style: { width: '100%' },
            size: 'small'
          },
          {
            default: () =>
              (props.data.columns ?? []).map((col: string) =>
                h(ElTableColumn as any, {
                  key: col,
                  prop: col,
                  label: col,
                  minWidth: 100
                })
              )
          }
        )
      ]);
  }
});

const ElFormBlock = defineComponent({
  name: 'ElFormBlock',
  props: { data: { type: Object, required: true } },
  setup(props) {
    return () =>
      h(
        'div',
        {
          style:
            'margin:16px 0;padding:12px;border:1px solid #ebeef5;border-radius:6px;'
        },
        [
          h(
            ElForm as any,
            { labelWidth: '80px', size: 'small' },
            {
              default: () =>
                (props.data.fields ?? []).map((f: any, i: number) =>
                  h(
                    ElFormItem as any,
                    { key: i, label: f.label },
                    {
                      default: () =>
                        h(ElInput as any, {
                          modelValue: f.value,
                          'onUpdate:modelValue': () => {}
                        })
                    }
                  )
                )
            }
          )
        ]
      );
  }
});

const MyEchartsBlock = defineComponent({
  name: 'MyEchartsBlock',
  props: { option: { type: Object, required: true } },
  setup(props) {
    const chartEl = vRef<HTMLDivElement>();
    vOnMounted(async () => {
      if (!chartEl.value) return;
      try {
        const echarts = await import('echarts');
        const chart = echarts.init(chartEl.value);
        chart.setOption(props.option);
        const ro = new ResizeObserver(() => chart.resize());
        ro.observe(chartEl.value);
      } catch (e) {
        console.warn('[my-echarts] init failed', e);
      }
    });
    return () =>
      h('div', {
        ref: chartEl,
        style: 'width:100%;height:300px;margin:16px 0;'
      });
  }
});

// ─── Skeleton placeholder ────────────────────────────────────────────────────
function skeletonOf(kind: 'el-table' | 'el-form' | 'my-echarts') {
  const rows = kind === 'my-echarts' ? 6 : 4;
  return h(
    'div',
    {
      style:
        'margin:16px 0;padding:12px;border:1px dashed #dcdfe6;border-radius:6px;background:#fafafa;'
    },
    [
      h(
        'div',
        { style: 'font-size:12px;color:#909399;margin-bottom:8px;' },
        `⏳ Streaming ${kind} data...`
      ),
      h(ElSkeleton as any, { rows, animated: true })
    ]
  );
}

// ─── codeXRender: parse fail → skeleton; success → real component ────────────
function safeParse(s: string): { ok: true; value: any } | { ok: false } {
  try {
    return { ok: true, value: JSON.parse(s) };
  } catch {
    return { ok: false };
  }
}

const codeXRender = {
  'el-table': (props: any) => {
    const r = safeParse(props.raw.content);
    return r.ok ? h(ElTableBlock, { data: r.value }) : skeletonOf('el-table');
  },
  'el-form': (props: any) => {
    const r = safeParse(props.raw.content);
    return r.ok ? h(ElFormBlock, { data: r.value }) : skeletonOf('el-form');
  },
  'my-echarts': (props: any) => {
    const r = safeParse(props.raw.content);
    return r.ok
      ? h(MyEchartsBlock, { option: r.value })
      : skeletonOf('my-echarts');
  }
};
</script>

<template>
  <div>
    <el-button
      type="primary"
      :loading="isStreaming"
      style="margin-bottom: 12px"
      @click="startStream"
    >
      {{ isStreaming ? 'Streaming...' : 'Start Streaming' }}
    </el-button>
    <component
      :is="MarkdownRenderer"
      v-if="MarkdownRenderer"
      :markdown="streamContent"
      :code-x-render="codeXRender"
    />
    <div v-else style="padding: 16px; color: #999">Loading...</div>
  </div>
</template>
