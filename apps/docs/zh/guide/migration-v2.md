---
title: 从 v1 迁移到 v2
---

# 从 v1 迁移到 v2

## 概述

v2.0.0 是一次重大版本更新，包含多项破坏性变更。以下是关键变化概要：

- **6 个组件移除/重命名**：`Typewriter`、`XMarkdown`、`XMarkdownAsync`、`Sender`、`MentionSender`、`EditorSender` 不再内置
- **2 个新组件**：`XSender`、`ConfigProvider`
- **新增主题系统**：基于 `--elx-*` CSS 变量，支持亮色/暗色模式切换
- **Hooks 变更**：移除 `usePrism`，新增 `useNamespace`、`useTheme`；`XRequest` 已废弃
- **Markdown 渲染独立为外部包**：[x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)

::: tip 迁移建议
在开始迁移之前，请确保你的项目已备份。建议先在开发环境中完成迁移，确认无误后再部署到生产环境。
:::

## 快速检查清单

| 迁移项                      | 类型   | 影响范围             | 详情                                                                                |
| --------------------------- | ------ | -------------------- | ----------------------------------------------------------------------------------- |
| `Typewriter`                | 移除   | 使用打字机效果的页面 | → [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue) + `enable-animate` |
| `XMarkdown`                 | 移除   | Markdown 渲染        | → `x-markdown-vue` 的 `MarkdownRenderer`                                            |
| `XMarkdownAsync`            | 移除   | 异步 Markdown 渲染   | → `x-markdown-vue` 的 `MarkdownRenderer`                                            |
| `Sender`                    | 重命名 | 输入框组件           | → `XSender`                                                                         |
| `MentionSender`             | 重命名 | 带提及功能的输入框   | → `XSender` + `mentionConfig`                                                       |
| `EditorSender`              | 重命名 | 富文本输入框         | → `XSender`（API 变化不大，需插件版本 > 1.3.98）                                    |
| `usePrism`                  | 移除   | 代码高亮 hook        | → `x-markdown-vue` 内置 Shiki                                                       |
| `XRequest`                  | 废弃   | SSE 请求             | → 推荐 [hook-fetch](https://jsonlee12138.github.io/hook-fetch/)                     |
| `useSend`                   | 无变化 | 发送状态管理 hook    | 直接继续使用                                                                        |
| `useRecord`                 | 无变化 | 语音识别 hook        | 直接继续使用                                                                        |
| `useXStream`                | 无变化 | SSE 流式处理 hook    | 直接继续使用                                                                        |
| `useNamespace`              | 新增   | —                    | 组件内部使用的 BEM 命名空间 hook                                                    |
| `useTheme`                  | 新增   | —                    | 主题变量管理 hook                                                                   |
| `ConfigProvider`            | 新增   | —                    | 全局主题与暗色模式配置                                                              |
| `BubbleList.triggerIndices` | 移除   | 使用该属性的页面     | 已从源码移除，无需迁移                                                              |
| `BubbleList.@complete`      | 移除   | 监听该事件的页面     | 已从源码移除，无需迁移                                                              |
| CSS 变量                    | 变更   | 自定义样式           | `--elx-*` 前缀                                                                      |

## 升级依赖

### 版本要求

| 依赖         | 最低版本                | 说明                           |
| ------------ | ----------------------- | ------------------------------ |
| Vue          | >= 3.5.17               | v2 对 Vue 响应式系统有更高要求 |
| Element Plus | >= 2.9.7                | 组件依赖 Element Plus 新特性   |
| Node.js      | >= 18.x（推荐 >= 20.x） | 开发环境要求                   |

### 升级命令

::: code-group

```sh [pnpm]
pnpm update vue-element-plus-x@latest
pnpm update vue@">=3.5.17"
pnpm update element-plus@">=2.9.7"
```

```sh [npm]
npm install vue-element-plus-x@latest
npm install vue@">=3.5.17"
npm install element-plus@">=2.9.7"
```

```sh [yarn]
yarn add vue-element-plus-x@latest
yarn add vue@">=3.5.17"
yarn add element-plus@">=2.9.7"
```

:::

### 安装 x-markdown-vue（如需 Markdown 渲染）

如果你的项目使用了 `Typewriter`、`XMarkdown` 或 `XMarkdownAsync`，需要安装独立包：

::: code-group

```sh [pnpm]
pnpm add x-markdown-vue
pnpm add katex
pnpm add shiki shiki-stream
```

```sh [npm]
npm install x-markdown-vue
npm install katex
npm install shiki shiki-stream
```

```sh [yarn]
yarn add x-markdown-vue
yarn add katex
yarn add shiki shiki-stream
```

:::

::: info

- `katex`：用于 LaTeX 数学公式渲染（可选）
- `shiki` / `shiki-stream`：用于代码语法高亮（推荐）
  :::

## 移除的组件

### Typewriter → x-markdown-vue + enable-animate

v2.0.0 移除了内置的 `Typewriter` 组件。请使用 `x-markdown-vue` 的 `MarkdownRenderer` 配合 `enable-animate` 属性实现打字机效果。

<!-- v1 写法 -->

```vue
<template>
  <Bubble :avatar="avatar" placement="start">
    <template #content>
      <Typewriter :content="content" />
    </template>
  </Bubble>
</template>

<script setup>
import { Bubble, Typewriter } from 'vue-element-plus-x';
</script>
```

<!-- v2 写法 -->

```vue
<template>
  <Bubble :avatar="avatar" placement="start">
    <template #content>
      <MarkdownRenderer :markdown="content" :enable-animate="true" />
    </template>
  </Bubble>
</template>

<script setup>
import { Bubble } from 'vue-element-plus-x';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';
</script>
```

### XMarkdown / XMarkdownAsync → MarkdownRenderer

v2.0.0 不再内置 `XMarkdown` 和 `XMarkdownAsync`，改为使用独立包 `x-markdown-vue` 的 `MarkdownRenderer`。

<!-- v1 写法 -->

```vue
<template>
  <XMarkdown :content="content" />
</template>

<script setup>
import { XMarkdown } from 'vue-element-plus-x';
</script>
```

<!-- v2 写法 -->

```vue
<template>
  <MarkdownRenderer :markdown="content" />
</template>

<script setup>
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';
</script>
```

### Sender / MentionSender → XSender

`Sender` 和 `MentionSender` 已合并为 `XSender`。提及功能通过 `mentionConfig` 属性配置。

<!-- v1 写法 -->

```vue
<template>
  <Sender v-model="value" placeholder="输入消息..." />
</template>

<script setup>
import { ref } from 'vue';
import { Sender } from 'vue-element-plus-x';

const value = ref('');
</script>
```

<!-- v2 写法 -->

```vue
<template>
  <XSender v-model="value" placeholder="输入消息..." />
</template>

<script setup>
import { ref } from 'vue';
import { XSender } from 'vue-element-plus-x';

const value = ref('');
</script>
```

#### MentionSender 迁移

<!-- v1 写法 -->

```vue
<template>
  <MentionSender
    v-model="value"
    placeholder="@提及用户..."
    :mention-config="mentionConfig"
  />
</template>
```

<!-- v2 写法 -->

```vue
<template>
  <XSender
    v-model="value"
    placeholder="@提及用户..."
    :mention-config="mentionConfig"
  />
</template>
```

### EditorSender → XSender

::: info
`EditorSender` 重命名为 `XSender`，API 变化不大。请确保底层插件版本大于 `1.3.98`。
:::

<!-- v1 写法 -->

```vue
<template>
  <EditorSender v-model="value" />
</template>

<script setup>
import { ref } from 'vue';
import { EditorSender } from 'vue-element-plus-x';

const value = ref('');
</script>
```

<!-- v2 写法 -->

```vue
<template>
  <XSender v-model="value" variant="default" />
</template>

<script setup>
import { ref } from 'vue';
import { XSender } from 'vue-element-plus-x';

const value = ref('');
</script>
```

## BubbleList 变更

### `triggerIndices` 属性已移除

v2.0.0 已从源码中移除 `triggerIndices` 属性，请从模板中删除相关绑定。

<!-- v1 写法 -->

```vue
<BubbleList :list="list" :trigger-indices="'all'" />
```

<!-- v2 写法 -->

```vue
<BubbleList :list="list" />
```

### `@complete` 事件已移除

v2.0.0 已从源码中移除 `@complete` 事件，请从模板中删除相关监听。

<!-- v1 写法 -->

```vue
<BubbleList :list="list" @complete="onComplete" />
```

<!-- v2 写法 -->

```vue
<BubbleList :list="list" />
```

::: tip
v2 中打字效果不再由 BubbleList 控制，而是通过 `#content` 插槽配合 `MarkdownRenderer` 的 `enable-animate` 属性实现。流式场景下，只需将后端返回的字符**连续拼接**到 `item.content` 中，`MarkdownRenderer` 会自动增量渲染。
:::

### Markdown 渲染迁移（#content 插槽）

由于 `triggerIndices` 和 `@complete` 已移除，v2 推荐通过 `#content` 插槽配合 `MarkdownRenderer` 实现打字机效果和 Markdown 渲染：

<!-- v1 写法：BubbleList 内置 Typewriter -->

```vue
<template>
  <BubbleList :list="list" :trigger-indices="'all'" @complete="onComplete" />
</template>

<script setup>
import { BubbleList } from 'vue-element-plus-x';

const list = ref([
  { content: '你好！', placement: 'start', role: 'assistant' }
]);

const onComplete = (instance, index) => {
  console.log('打字完成:', index);
};
</script>
```

<!-- v2 写法：使用 #content 插槽 + MarkdownRenderer -->

```vue
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
  { content: '你好！', placement: 'start', role: 'assistant' }
]);
</script>
```

### 流式渲染：搭配 hook-fetch 拼接 SSE 字符

v2 中处理流式接口（SSE）的推荐方式是：使用 `hook-fetch` 接收后端流式数据，将每一段字符**连续拼接**到对应气泡的 `content` 字段上，`MarkdownRenderer` 会自动增量渲染 Markdown 内容。

```vue
<template>
  <BubbleList :list="list">
    <template #content="{ item }">
      <MarkdownRenderer :markdown="item.content" :enable-animate="true" />
    </template>
  </BubbleList>
  <XSender v-model="inputValue" @submit="handleSend" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { BubbleList, XSender } from 'vue-element-plus-x';
import { useHookFetch } from 'hook-fetch/vue';
import { sseTextDecoderPlugin } from 'hook-fetch/plugins/sse';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

interface MessageItem {
  role: 'user' | 'assistant';
  content: string;
  placement: 'start' | 'end';
}

const list = ref<MessageItem[]>([]);
const inputValue = ref('');

async function handleSend() {
  const userMsg = inputValue.value.trim();
  if (!userMsg) return;

  // 添加用户消息
  list.value.push({ role: 'user', content: userMsg, placement: 'end' });

  // 添加一条空的 AI 消息占位
  const aiIndex = list.value.length;
  list.value.push({ role: 'assistant', content: '', placement: 'start' });
  inputValue.value = '';

  // 使用 hook-fetch 发起 SSE 流式请求
  const { stream } = useHookFetch({
    url: '/api/chat',
    method: 'POST',
    body: JSON.stringify({ message: userMsg }),
    plugins: [sseTextDecoderPlugin()]
  });

  // 逐块拼接流式字符到对应气泡的 content 中
  for await (const chunk of stream()) {
    list.value[aiIndex].content += chunk.result ?? '';
  }
}
</script>
```

::: info

- `sseTextDecoderPlugin` 负责解码 SSE 文本流，`chunk.result` 即为每次解析出的文本片段
- 只需将片段持续拼接到 `item.content` 上，`MarkdownRenderer` 会自动完成增量渲染和打字机效果
- 更详细的 hook-fetch 用法请参考 [hook-fetch 文档](https://jsonlee12138.github.io/hook-fetch/)
  :::

## Hooks 变更

### usePrism 已移除

`usePrism` 已从 v2 中移除。代码高亮功能现由 `x-markdown-vue` 内置的 Shiki 提供，无需额外配置。

### useNamespace（新增）

组件内部使用的 BEM 命名空间 hook，提供 CSS 类名生成和变量绑定能力。一般情况下业务代码不需要直接使用。

### useTheme（新增）

主题变量管理 hook，提供 `isDark`、`themeOverrides` 等响应式属性。一般通过 `ConfigProvider` 组件间接使用。

### useRecord（无变化）

语音识别 hook，API 无变化，可直接继续使用。

### useXStream（无变化）

SSE 流式数据处理 hook，API 无变化，可直接继续使用。

### useSend（无变化）

前端 `loading` 状态管理 hook，与请求库无关，可直接继续使用。

### XRequest 已废弃

`XRequest` 已标记为废弃，推荐使用 [hook-fetch](https://jsonlee12138.github.io/hook-fetch/) 替代。

<!-- v1 写法 -->

```ts
import { XRequest } from 'vue-element-plus-x';

const request = new XRequest({
  baseURL: '/api',
  onMessage: msg => {
    // 处理流式消息
  }
});
request.send('/chat');
```

<!-- v2 写法 -->

```ts
import { useHookFetch } from 'hook-fetch';

const { data, loading, send } = useHookFetch({
  url: '/api/chat'
  // 参见 hook-fetch 文档
});
```

::: info
`useSend` hook 仍然可用，它是对前端 `loading` 状态的封装，与请求库无关。
:::

## 新增：ConfigProvider 主题系统

### 基础用法

`ConfigProvider` 是 v2 新增的全局配置组件，用于控制主题模式和覆盖主题变量。

```vue
<template>
  <ConfigProvider :theme="theme">
    <App />
  </ConfigProvider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { ConfigProvider } from 'vue-element-plus-x';

const theme = ref<'light' | 'dark'>('light');
</script>
```

### 暗色模式

将 `theme` 设置为 `'dark'` 即可开启暗色模式。开启时会在 `html` 元素上添加 `dark` 类名。

```vue
<template>
  <ConfigProvider :theme="isDark ? 'dark' : 'light'">
    <App />
  </ConfigProvider>
</template>
```

### themeOverrides

通过 `themeOverrides` 属性覆盖 `--elx-*` CSS 变量：

```vue
<script setup lang="ts">
const themeOverrides = {
  common: {
    'color-primary': '#7c3aed'
  },
  components: {
    Welcome: {
      'welcome-filled-bg': '#f0f9ff',
      'welcome-title-color': 'rgba(0, 0, 0, 0.88)'
    }
  }
};
</script>
```

::: tip
完整的主题变量列表请参见 [主题变量总表](/zh/guide/theme-tokens)。
:::

## CSS / 样式变更

### --elx-\* 变量前缀

v2 统一使用 `--elx-*` 作为主题 CSS 变量前缀，与 Element Plus 的 `--el-*` 前缀区分。

| 配置方式                                              | 映射关系                  |
| ----------------------------------------------------- | ------------------------- |
| `themeOverrides.common.color-primary`                 | `--elx-color-primary`     |
| `themeOverrides.common.bg-page`                       | `--elx-bg-page`           |
| `themeOverrides.components.Welcome.welcome-filled-bg` | `--elx-welcome-filled-bg` |

::: warning
`namespace` 属性只影响组件类名前缀，**不影响**主题 CSS 变量前缀。主题变量固定为 `--elx-*`。
:::

### 暗色模式

v2 的暗色模式通过 `ConfigProvider` 的 `theme` 属性控制。需要在项目中引入以下样式：

```ts
// main.ts
import 'element-plus/dist/index.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
import 'vue-element-plus-x/styles/index.css';
```

## SSR 兼容性

v2 对 SSR 环境进行了兼容性优化。如果你使用 SSR 部署，需要在 Vite 配置中将以下包标记为 `noExternal`：

```ts
// vite.config.ts
export default defineConfig({
  ssr: {
    noExternal: [
      'vue-element-plus-x',
      'shiki',
      'shiki-stream',
      'x-markdown-vue'
    ]
  }
});
```

## 完整迁移示例

以下是一个从 v1 完整迁移到 v2 的最小示例：

<!-- v1 写法 -->

```vue
<template>
  <div class="chat-app">
    <BubbleList :list="list" />
    <MentionSender v-model="inputValue" @submit="handleSend" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { BubbleList, MentionSender } from 'vue-element-plus-x';

const list = ref([{ content: '你好，有什么可以帮你的？', role: 'assistant' }]);
const inputValue = ref('');

const handleSend = () => {
  list.value.push({ content: inputValue.value, role: 'user' });
  inputValue.value = '';
};
</script>
```

<!-- v2 写法 -->

```vue
<template>
  <ConfigProvider :theme="isDark ? 'dark' : 'light'">
    <div class="chat-app">
      <BubbleList :list="list">
        <template #content="{ item }">
          <MarkdownRenderer :markdown="item.content" :enable-animate="true" />
        </template>
      </BubbleList>
      <XSender
        v-model="inputValue"
        :mention-config="mentionConfig"
        @submit="handleSend"
      />
    </div>
  </ConfigProvider>
</template>

<script setup>
import { ref } from 'vue';
import { BubbleList, XSender, ConfigProvider } from 'vue-element-plus-x';
import { MarkdownRenderer } from 'x-markdown-vue';
import 'x-markdown-vue/style';

const isDark = ref(false);
const mentionConfig = ref({
  /* 提及配置 */
});
const list = ref([{ content: '你好，有什么可以帮你的？', role: 'assistant' }]);
const inputValue = ref('');

const handleSend = () => {
  list.value.push({ content: inputValue.value, role: 'user' });
  inputValue.value = '';
};
</script>
```

## 常见问题 FAQ

### Q: 升级后样式错乱怎么办？

A: 请确保引入了正确的样式文件：

```ts
import 'element-plus/dist/index.css';
import 'vue-element-plus-x/styles/index.css';
```

如果使用了暗色模式，还需引入 Element Plus 的暗色样式：

```ts
import 'element-plus/theme-chalk/dark/css-vars.css';
```

### Q: XSender 和旧版 EditorSender 有什么区别？

A: `XSender` 的 API 变化不大，主要是名称变更，同时新增了布局方式（`variant`）、设备适配（`device`）等属性。详细的 API 参见 [XSender 文档](/zh/components/xsender/)。

### Q: 如何在 VitePress 中接入暗色模式？

A: 参见 [主题配置 - VitePress 接入](/zh/guide/theme#vitepress-接入)。

### Q: XRequest 还能用吗？

A: `XRequest` 目前仍可用，但已标记为废弃。推荐迁移到 [hook-fetch](https://jsonlee12138.github.io/hook-fetch/)，它提供了更完善的请求管理能力。

### Q: 旧版项目的 namespace 配置还有效吗？

A: `namespace` 属性仍然可用，它只影响组件类名前缀。但请注意，主题 CSS 变量前缀固定为 `--elx-*`，不受 `namespace` 影响。
