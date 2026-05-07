<docs>
---
title: Custom Table (el-table Slot)
---

Override Markdown GFM table rendering via the `#table` slot. The slot exposes `children` (a function returning a VNode array) — recursively walk `<thead>` / `<tbody>` to collect columns and rows, then render with `el-table` for borders, stripes, and more.
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

const content = `## Frontend Framework Comparison

| Framework | Latest Version | GitHub Stars | Learning Curve | TypeScript |
|-----------|---------------|-------------|----------------|-----------|
| Vue | 3.4 | 48k | Low | ✅ |
| React | 18.3 | 225k | Medium | ✅ |
| Angular | 17 | 93k | High | ✅ |
| Svelte | 5.0 | 78k | Low | ✅ |

## Component Library Comparison

| Library | Framework | Theming | Enterprise | i18n |
|---------|-----------|---------|------------|------|
| Element Plus | Vue 3 | ✅ | ✅ | ✅ |
| Ant Design | React | ✅ | ✅ | ✅ |
| Vuetify | Vue 3 | ✅ | ✅ | ✅ |
| Naive UI | Vue 3 | ✅ | ❌ | ✅ |
`;

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
    <!-- Replace all Markdown tables with el-table -->
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
  <div v-else style="padding: 16px; color: #999">Loading...</div>
</template>
