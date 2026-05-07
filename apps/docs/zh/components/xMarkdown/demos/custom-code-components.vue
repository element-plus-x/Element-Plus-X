<docs>
---
title: 自定义代码块组件（el-table & my-echarts）
---

通过 `code-x-render` 将特定语言的代码块渲染为 Vue 组件。本示例中：

- **`el-table`** 语言块 — 将 JSON 数据渲染为 Element Plus 表格
- **`my-echarts`** 语言块 — 将 ECharts JSON 配置渲染为交互式图表
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

const content = `## 使用 \`el-table\` 展示员工数据

在代码块中写入 JSON，语言设为 \`el-table\`，自动渲染为 Element Plus 表格：

\`\`\`el-table
{
  "columns": ["姓名", "职位", "部门", "入职年份", "状态"],
  "rows": [
    { "姓名": "张三", "职位": "前端工程师", "部门": "研发部", "入职年份": "2021", "状态": "在职" },
    { "姓名": "李四", "职位": "产品经理", "部门": "产品部", "入职年份": "2020", "状态": "在职" },
    { "姓名": "王五", "职位": "UI 设计师", "部门": "设计部", "入职年份": "2022", "状态": "在职" },
    { "姓名": "赵六", "职位": "后端工程师", "部门": "研发部", "入职年份": "2019", "状态": "在职" },
    { "姓名": "陈七", "职位": "测试工程师", "部门": "测试部", "入职年份": "2023", "状态": "试用" }
  ]
}
\`\`\`

## 使用 \`my-echarts\` 展示图表

在代码块中写入 ECharts option JSON，语言设为 \`my-echarts\`，自动渲染为交互式图表：

\`\`\`my-echarts
{
  "title": { "text": "各部门人员分布", "left": "center" },
  "tooltip": { "trigger": "item", "formatter": "{b}: {c} 人 ({d}%)" },
  "legend": { "bottom": "5%" },
  "series": [{
    "type": "pie",
    "radius": ["40%", "70%"],
    "avoidLabelOverlap": true,
    "itemStyle": { "borderRadius": 8, "borderWidth": 2 },
    "label": { "show": true },
    "data": [
      { "value": 45, "name": "研发部" },
      { "value": 20, "name": "产品部" },
      { "value": 15, "name": "设计部" },
      { "value": 12, "name": "测试部" },
      { "value": 8,  "name": "市场部" }
    ]
  }]
}
\`\`\`
`;

// ─── el-table 组件 ───────────────────────────────────────────────────────────
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

// ─── ECharts 组件 ────────────────────────────────────────────────────────────
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
        // 响应式宽度
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

// ─── codeXRender 映射 ────────────────────────────────────────────────────────
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
        '⚠ 图表 JSON 解析失败，请检查语法'
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
  <div v-else style="padding: 16px; color: #999">加载中...</div>
</template>
