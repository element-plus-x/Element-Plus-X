---
title: 'XMarkdown'
---

## 介绍

`x-markdown-vue` 是从 `vue-element-plus-x` 中抽离出来的 Markdown 渲染组件库，用于 AI 对话场景中的富文本展示与流式输出渲染。

从 `v2.0.0` 开始，组件库不再内置 `Typewriter` / `XMarkdown` / `XMarkdownAsync`，如需 Markdown 渲染，请单独安装并在业务侧集成。

- NPM: [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)
- GitHub: [element-plus-x/x-markdown](https://github.com/element-plus-x/x-markdown)

## 安装

```bash
pnpm add x-markdown-vue
```

## 基础用法

```vue
<template>
  <MarkdownRenderer :markdown="content" />
</template>

<script setup>
import { ref } from 'vue';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const content = ref('# Hello World\n\n这是 **Markdown** 内容');
</script>
```

## 与 Bubble / BubbleList 搭配

### Bubble

`Bubble` 本身提供 `#content` 插槽，可以直接将 `MarkdownRenderer` 放入插槽中：

- 参考：[Bubble](/zh/components/bubble/#与-x-markdown-vue-结合使用)

### BubbleList

`BubbleList` 支持透传 `#content` 插槽，并在 slot 参数中提供当前 `item`，因此可以对列表中的每条消息进行 Markdown 渲染：

````vue
<template>
  <BubbleList :list="list">
    <template #content="{ item }">
      <MarkdownRenderer :markdown="item.content" :enable-animate="true" />
    </template>
  </BubbleList>
</template>

<script setup>
import { ref } from 'vue';
import { BubbleList } from 'vue-element-plus-x';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const list = ref([
  { content: '## 标题\n\n- 列表项 1\n- 列表项 2', placement: 'start' },
  { content: '```ts\nconsole.log(\"hello\")\n```', placement: 'end' }
]);
</script>
````
