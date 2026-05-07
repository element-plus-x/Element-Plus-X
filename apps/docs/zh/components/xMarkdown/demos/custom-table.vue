<docs>
---
title: 自定义表格（el-table 插槽）
---

通过 `#table` 插槽拦截 Markdown 中的 GFM 表格。插槽暴露 `children`（一个返回 VNode 数组的函数），递归读取 `<thead>` / `<tbody>` 即可拿到列与行，再用 `el-table` 渲染获得边框、条纹等能力。
</docs>

<script setup lang="ts">
import 'shiki';
import 'shiki-stream';

const MarkdownRenderer = shallowRef();
onMounted(async () => {
  if (typeof window === 'undefined') return;
  await import('x-markdown-vue/style');
  const mod = await import('x-markdown-vue');
  MarkdownRenderer.value = mod.MarkdownRenderer ?? mod.default ?? mod;
});

const content = `## 前端框架对比

| 框架 | 最新版本 | GitHub Stars | 学习曲线 | TypeScript |
|------|----------|-------------|----------|-----------|
| Vue | 3.4 | 48k | 低 | ✅ |
| React | 18.3 | 225k | 中 | ✅ |
| Angular | 17 | 93k | 高 | ✅ |
| Svelte | 5.0 | 78k | 低 | ✅ |

## 组件库对比

| 组件库 | 所属框架 | 主题定制 | 企业级支持 | 国际化 |
|--------|----------|----------|----------|--------|
| Element Plus | Vue 3 | ✅ | ✅ | ✅ |
| Ant Design | React | ✅ | ✅ | ✅ |
| Vuetify | Vue 3 | ✅ | ✅ | ✅ |
| Naive UI | Vue 3 | ✅ | ❌ | ✅ |
`;

// 递归从 VNode 子树提取纯文本
function vnodeText(vn: any): string {
  if (vn == null || vn === false || vn === true) return '';
  if (typeof vn === 'string' || typeof vn === 'number') return String(vn);
  if (Array.isArray(vn)) return vn.map(vnodeText).join('');
  if (typeof vn === 'object' && 'children' in vn)
    return vnodeText((vn as any).children);
  return '';
}

function findByTag(children: any, tag: string): any[] {
  if (!children) return [];
  const list = Array.isArray(children) ? children : [children];
  return list.filter(
    c => c && typeof c === 'object' && (c as any).type === tag
  );
}

function extractTableData(children: any) {
  const columns: string[] = [];
  const rows: Record<string, string>[] = [];
  const top = Array.isArray(children) ? children : [children];

  for (const section of top) {
    if (!section || typeof section !== 'object') continue;
    if ((section as any).type === 'thead') {
      const tr = findByTag((section as any).children, 'tr')[0];
      const ths = findByTag(tr?.children, 'th');
      for (const th of ths) columns.push(vnodeText(th.children));
    } else if ((section as any).type === 'tbody') {
      const trs = findByTag((section as any).children, 'tr');
      for (const tr of trs) {
        const tds = findByTag(tr.children, 'td');
        const row: Record<string, string> = {};
        tds.forEach((td, i) => {
          row[columns[i] ?? String(i)] = vnodeText(td.children);
        });
        rows.push(row);
      }
    }
  }
  return { columns, rows };
}
</script>

<template>
  <component :is="MarkdownRenderer" v-if="MarkdownRenderer" :markdown="content">
    <!-- 用 el-table 替换所有 Markdown 表格 -->
    <template #table="{ children }">
      <div style="margin: 16px 0">
        <template v-if="children">
          <el-table
            :data="extractTableData(children()).rows"
            border
            stripe
            style="width: 100%"
            size="small"
          >
            <el-table-column
              v-for="col in extractTableData(children()).columns"
              :key="col"
              :prop="col"
              :label="col"
              min-width="100"
            />
          </el-table>
        </template>
      </div>
    </template>
  </component>
  <div v-else style="padding: 16px; color: #999">加载中...</div>
</template>
