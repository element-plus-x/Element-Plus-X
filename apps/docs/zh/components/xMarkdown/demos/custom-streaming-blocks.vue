<docs>
---
title: 流式自定义代码块（骨架屏占位）
---

模拟 AI 流式输出的真实场景：当 \`el-table\` / \`el-form\` / \`my-echarts\` 代码块的 JSON 还在拼接中时，用 **el-skeleton 骨架屏** 占位；一旦 JSON 完整可解析，立刻切换为对应的真实组件回显。

判定方式：在 `code-x-render` 里尝试 `JSON.parse(props.raw.content)`，**解析失败 → 骨架屏；解析成功 → 真实组件**，配合流式更新自然呈现"骨架屏 → 内容"的过渡。
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

const fullText = `## 流式输出示例

下面三个代码块会随着流式拼接，先显示骨架屏，等 JSON 完整后切换为真实组件：

\`\`\`el-table
{
  "columns": ["姓名", "职位", "部门"],
  "rows": [
    { "姓名": "张三", "职位": "前端工程师", "部门": "研发部" },
    { "姓名": "李四", "职位": "产品经理", "部门": "产品部" },
    { "姓名": "王五", "职位": "UI 设计师", "部门": "设计部" }
  ]
}
\`\`\`

\`\`\`el-form
{
  "fields": [
    { "label": "姓名", "value": "张三" },
    { "label": "邮箱", "value": "zhangsan@example.com" },
    { "label": "部门", "value": "研发部" }
  ]
}
\`\`\`

\`\`\`my-echarts
{
  "title": { "text": "季度销售额", "left": "center" },
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
      // 一次推进若干字符，让流式更顺滑
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

// ─── 真实组件 ────────────────────────────────────────────────────────────────
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

// ─── 骨架屏占位 ─────────────────────────────────────────────────────────────
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
        `⏳ ${kind} 数据流式加载中…`
      ),
      h(ElSkeleton as any, { rows, animated: true })
    ]
  );
}

// ─── codeXRender：解析失败 → 骨架屏；成功 → 真实组件 ─────────────────────────
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
      {{ isStreaming ? '流式输出中...' : '开始流式输出' }}
    </el-button>
    <component
      :is="MarkdownRenderer"
      v-if="MarkdownRenderer"
      :markdown="streamContent"
      :code-x-render="codeXRender"
    />
    <div v-else style="padding: 16px; color: #999">加载中...</div>
  </div>
</template>
