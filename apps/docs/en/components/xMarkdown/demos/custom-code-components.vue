<docs>
---
title: Custom Code Block Components (el-table & my-echarts)
---

Use `code-x-render` to render specific code block languages as Vue components:

- **`el-table`** blocks — render JSON data as an Element Plus table
- **`my-echarts`** blocks — render ECharts JSON config as an interactive chart
</docs>

<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus';
import {
  defineComponent,
  h,
  computed as vComputed,
  onMounted as vOnMounted,
  ref as vRef
} from 'vue';
import 'shiki';
import 'shiki-stream';

const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value = mod.MarkdownRenderer ?? mod.default ?? mod;
});

const content = `## Display Data with \`el-table\`

Write JSON in a code block and set the language to \`el-table\` to auto-render as an Element Plus table:

\`\`\`el-table
{
  "columns": ["Name", "Role", "Department", "Year Joined", "Status"],
  "rows": [
    { "Name": "Alice",   "Role": "Frontend Engineer", "Department": "R&D",     "Year Joined": "2021", "Status": "Active" },
    { "Name": "Bob",     "Role": "Product Manager",   "Department": "Product", "Year Joined": "2020", "Status": "Active" },
    { "Name": "Charlie", "Role": "UI Designer",       "Department": "Design",  "Year Joined": "2022", "Status": "Active" },
    { "Name": "Diana",   "Role": "Backend Engineer",  "Department": "R&D",     "Year Joined": "2019", "Status": "Active" },
    { "Name": "Evan",    "Role": "QA Engineer",       "Department": "QA",      "Year Joined": "2023", "Status": "Probation" }
  ]
}
\`\`\`

## Display Charts with \`my-echarts\`

Write an ECharts option JSON and set the language to \`my-echarts\` to auto-render as an interactive chart:

\`\`\`my-echarts
{
  "title": { "text": "Team Distribution by Department", "left": "center" },
  "tooltip": { "trigger": "item", "formatter": "{b}: {c} ({d}%)" },
  "legend": { "bottom": "5%" },
  "series": [{
    "type": "pie",
    "radius": ["40%", "70%"],
    "avoidLabelOverlap": true,
    "itemStyle": { "borderRadius": 8, "borderWidth": 2 },
    "label": { "show": true },
    "data": [
      { "value": 45, "name": "R&D" },
      { "value": 20, "name": "Product" },
      { "value": 15, "name": "Design" },
      { "value": 12, "name": "QA" },
      { "value": 8,  "name": "Marketing" }
    ]
  }]
}
\`\`\`
`;

// ─── el-table component ───────────────────────────────────────────────────────
const ElTableBlock = defineComponent({
  name: 'ElTableBlock',
  props: {
    rawJson: { type: String, required: true }
  },
  setup(props) {
    const parsed = vComputed(() => {
      try {
        const v = JSON.parse(props.rawJson);
        return {
          columns: Array.isArray(v.columns) ? v.columns : [],
          rows: Array.isArray(v.rows) ? v.rows : []
        };
      } catch {
        return { columns: [] as string[], rows: [] as any[] };
      }
    });
    return () =>
      h('div', { style: 'margin:16px 0;' }, [
        h(
          ElTable as any,
          {
            data: parsed.value.rows,
            border: true,
            stripe: true,
            style: { width: '100%' },
            size: 'small'
          },
          {
            default: () =>
              parsed.value.columns.map((col: string) =>
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

// ─── ECharts component ────────────────────────────────────────────────────────
const MyEchartsBlock = defineComponent({
  name: 'MyEchartsBlock',
  props: {
    option: { type: Object, required: true }
  },
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
        console.warn('[my-echarts] echarts init failed', e);
      }
    });

    return () =>
      h('div', {
        ref: chartEl,
        style: 'width:100%;height:320px;margin:16px 0;'
      });
  }
});

// ─── codeXRender map ──────────────────────────────────────────────────────────
const codeXRender = {
  'el-table': (props: any) => h(ElTableBlock, { rawJson: props.raw.content }),

  'my-echarts': (props: any) => {
    try {
      const option = JSON.parse(props.raw.content);
      return h(MyEchartsBlock, { option });
    } catch {
      return h(
        'div',
        {
          style:
            'color:#f56c6c;padding:8px;border:1px dashed #f56c6c;border-radius:4px;'
        },
        '⚠ Failed to parse chart JSON — check the syntax.'
      );
    }
  }
};
</script>

<template>
  <component
    :is="MarkdownRenderer"
    v-if="MarkdownRenderer"
    :markdown="content"
    :code-x-render="codeXRender"
  />
  <div v-else style="padding: 16px; color: #999">Loading...</div>
</template>
