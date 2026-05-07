---
title: 'XMarkdown'
---

::: info
从 `v2.0.0` 开始，`vue-element-plus-x` 不再内置 Markdown 渲染组件。如需 Markdown 渲染功能，请单独安装 `x-markdown-vue`。
:::

## 介绍

`x-markdown-vue` 是从 `vue-element-plus-x` 中抽离出来的独立 Markdown 渲染组件库，专为 AI 对话场景中的富文本展示与流式输出渲染而设计。

### ✨ 核心特性

- 🚀 **流式渲染** — 支持 AI 对话场景的实时输出动画，带逐字淡入效果
- 📝 **GitHub Flavored Markdown** — 完整支持 GFM 语法（表格、任务列表等）
- 🎨 **代码高亮** — 基于 Shiki，支持 100+ 语言和多种主题，可按需禁用
- 🧮 **LaTeX 数学公式** — 支持行内 `$...$` 与块级 `$$...$$` 数学公式
- 📊 **Mermaid 图表** — 支持流程图、时序图、甘特图、类图等，可按需禁用
- 🌗 **深色模式** — 内置深浅色主题切换支持
- 🔌 **高度可定制** — 支持自定义渲染插槽、自定义属性、自定义代码块渲染器
- 🎭 **灵活插件系统** — 支持 remark 和 rehype 插件扩展
- 🔒 **安全可靠** — 可选的 HTML 内容清理，防止 XSS 攻击

从 `v2.0.0` 开始，组件库不再内置 `Typewriter` / `XMarkdown` / `XMarkdownAsync`，如需 Markdown 渲染，请单独安装并在业务侧集成。

- NPM: [x-markdown-vue](https://www.npmjs.com/package/x-markdown-vue)
- GitHub: [element-plus-x/x-markdown](https://github.com/element-plus-x/x-markdown)
- 在线演示: [x-markdown.netlify.app](https://x-markdown.netlify.app/)

## 安装

```bash
# pnpm（推荐）
pnpm add x-markdown-vue

# npm
npm install x-markdown-vue

# yarn
yarn add x-markdown-vue
```

### 可选依赖

`x-markdown-vue` 采用按需加载策略，以下功能需要安装对应依赖：

```bash
# 代码高亮（Shiki）
pnpm add shiki shiki-stream

# Mermaid 图表
pnpm add mermaid

# LaTeX 数学公式（还需引入 KaTeX 样式）
pnpm add katex
```

::: tip
如果不安装 `shiki` 和 `shiki-stream`，控制台可能会出现警告，代码块将降级为纯文本渲染。
:::

## 代码演示

### 基础用法

<demo src="./demos/basic.vue"></demo>

### 流式渲染动画

<demo src="./demos/streaming.vue"></demo>

### 深色模式

<demo src="./demos/dark-mode.vue"></demo>

### 代码块配置

<demo src="./demos/code-block-config.vue"></demo>

### 搭配 BubbleList 使用粘性代码头部

将 `MarkdownRenderer` 放入 `BubbleList` 的 `#content` 插槽，以 BubbleList 自身作为滚动容器。滚动时代码块头部吸附到 **列表可视区顶部**，不受页面导航栏遮挡。

<demo src="./demos/bubble-list-sticky.vue"></demo>

### LaTeX 数学公式

需安装 `katex`：`pnpm add katex`，并在入口引入样式：

```ts
import 'katex/dist/katex.min.css';
```

<demo src="./demos/latex.vue"></demo>

### Mermaid 图表

需安装 `mermaid`：`pnpm add mermaid`

<demo src="./demos/mermaid.vue"></demo>

### 自定义代码块操作按钮

通过 `code-block-actions` 数组为代码块添加自定义操作按钮，支持 `show` 回调按语言条件显示。

`onClick` 回调接收的 `CodeBlockSlotProps` 参数：

| 属性             | 类型                     | 说明         |
| ---------------- | ------------------------ | ------------ |
| `language`       | `string`                 | 代码语言     |
| `code`           | `string`                 | 代码内容     |
| `copy`           | `(text: string) => void` | 复制函数     |
| `copied`         | `boolean`                | 是否已复制   |
| `collapsed`      | `boolean`                | 是否已折叠   |
| `toggleCollapse` | `() => void`             | 切换折叠状态 |

<demo src="./demos/code-block-actions.vue"></demo>

### 自定义 Mermaid 操作按钮

通过 `mermaid-actions` 数组为 Mermaid 图表工具栏添加自定义按钮。

`onClick` 回调接收的 `MermaidSlotProps` 参数：

| 属性             | 类型                  | 说明                |
| ---------------- | --------------------- | ------------------- |
| `showSourceCode` | `boolean`             | 是否显示源码视图    |
| `svg`            | `string`              | 渲染后的 SVG 字符串 |
| `rawContent`     | `string`              | Mermaid 原始代码    |
| `isLoading`      | `boolean`             | 是否正在渲染        |
| `zoomIn`         | `() => void`          | 放大                |
| `zoomOut`        | `() => void`          | 缩小                |
| `reset`          | `() => void`          | 重置缩放            |
| `fullscreen`     | `() => void`          | 全屏                |
| `toggleCode`     | `() => void`          | 切换源码/图表视图   |
| `copyCode`       | `() => Promise<void>` | 复制源码            |
| `download`       | `() => void`          | 下载 SVG            |

<demo src="./demos/mermaid-actions.vue"></demo>

### 自定义代码块渲染器

<demo src="./demos/code-x-render.vue"></demo>

### 自定义属性

<demo src="./demos/custom-attrs.vue"></demo>

### 自定义插槽

支持的插槽名称：

| 插槽名                                           | 说明           |
| ------------------------------------------------ | -------------- |
| `heading` / `h1` ~ `h6`                          | 标题           |
| `code` / `inline-code` / `block-code`            | 代码           |
| `blockquote`                                     | 引用块         |
| `list` / `ul` / `ol` / `li` / `list-item`        | 列表           |
| `table` / `thead` / `tbody` / `tr` / `td` / `th` | 表格           |
| `a`                                              | 链接           |
| `img`                                            | 图片           |
| `p` / `strong` / `em`                            | 段落与行内元素 |
| 所有标准 HTML 标签名                             | —              |

<demo src="./demos/custom-slots.vue"></demo>

### 自定义表格（el-table 插槽）

通过 `#table` 插槽拦截 Markdown 中所有 GFM 表格，从插槽暴露的 hast `node` 中提取列和行数据，然后传入 `el-table` 渲染，获得排序、条纹、边框等完整能力。

<demo src="./demos/custom-table.vue"></demo>

### 自定义代码块组件（el-table & my-echarts）

通过 `code-x-render` 自定义"语言标签"，在 Markdown 中用围栏代码块声明 `el-table` 或 `my-echarts` 语言，即可自动渲染为对应的 Vue 组件：

- **`el-table`** — 解析 JSON `{ columns, rows }` 并渲染为 Element Plus 表格
- **`my-echarts`** — 解析 ECharts `option` JSON 并渲染为交互式图表

<demo src="./demos/custom-code-components.vue"></demo>

### 插件系统

通过 `remark-plugins` / `remark-plugins-ahead` / `rehype-plugins` / `rehype-plugins-ahead` 扩展解析管道：

```ts
import remarkEmoji from 'remark-emoji';
import rehypeSlug from 'rehype-slug';

// 在业务组件中传入
const remarkPlugins = [remarkEmoji];
const rehypePlugins = [rehypeSlug];
```

```vue
<MarkdownRenderer
  :markdown="content"
  :remark-plugins="remarkPlugins"
  :rehype-plugins="rehypePlugins"
/>
```

### 安全配置

启用 `sanitize` 后，渲染前会清洗 HTML 内容，防止 XSS 注入：

```vue
<MarkdownRenderer
  :markdown="content"
  :sanitize="true"
  :sanitize-options="{ allowedTags: ['b', 'i', 'em', 'strong', 'a'] }"
/>
```

### 流式自定义代码块（骨架屏占位）

模拟 AI 流式输出场景：JSON 拼接过程中显示 `el-skeleton` 骨架屏，等数据可解析后切换为对应的 `el-table` / `el-form` / `my-echarts` 真实组件。

<demo src="./demos/custom-streaming-blocks.vue"></demo>

## API

### Props

| 属性                       | 类型                           | 默认值                              | 说明                          |
| -------------------------- | ------------------------------ | ----------------------------------- | ----------------------------- |
| `markdown`                 | `string`                       | `''`                                | Markdown 文本内容             |
| `allow-html`               | `boolean`                      | `false`                             | 是否允许 HTML 内容            |
| `enable-latex`             | `boolean`                      | `true`                              | 是否启用 LaTeX 数学公式       |
| `enable-animate`           | `boolean`                      | `false`                             | 是否启用流式渲染动画          |
| `enable-breaks`            | `boolean`                      | `true`                              | 是否将单个换行转为 `<br>`     |
| `enable-gfm`               | `boolean`                      | `true`                              | 是否启用 GFM 语法             |
| `enable-shiki`             | `boolean`                      | `true`                              | 是否启用 Shiki 代码高亮       |
| `enable-mermaid`           | `boolean`                      | `true`                              | 是否启用 Mermaid 图表         |
| `is-dark`                  | `boolean`                      | `false`                             | 是否为深色模式                |
| `shiki-theme`              | `[BuiltinTheme, BuiltinTheme]` | `['vitesse-light', 'vitesse-dark']` | Shiki 浅色/深色主题           |
| `show-code-block-header`   | `boolean`                      | `true`                              | 是否显示代码块头部            |
| `sticky-code-block-header` | `boolean`                      | `false`                             | 代码块头部是否吸顶            |
| `code-max-height`          | `string`                       | `undefined`                         | 代码块最大高度，如 `'300px'`  |
| `code-block-actions`       | `CodeBlockAction[]`            | `[]`                                | 代码块自定义操作按钮          |
| `mermaid-actions`          | `MermaidAction[]`              | `[]`                                | Mermaid 图表自定义操作按钮    |
| `mermaid-config`           | `object`                       | `{}`                                | Mermaid 初始化配置            |
| `code-x-render`            | `object`                       | `{}`                                | 自定义代码块渲染函数          |
| `custom-attrs`             | `CustomAttrs`                  | `{}`                                | 自定义元素属性                |
| `remark-plugins`           | `PluggableList`                | `[]`                                | remark 插件列表（内置后运行） |
| `remark-plugins-ahead`     | `PluggableList`                | `[]`                                | remark 插件列表（内置前运行） |
| `rehype-plugins`           | `PluggableList`                | `[]`                                | rehype 插件列表（内置后运行） |
| `rehype-plugins-ahead`     | `PluggableList`                | `[]`                                | rehype 插件列表（内置前运行） |
| `rehype-options`           | `object`                       | `{}`                                | rehype 处理器配置             |
| `sanitize`                 | `boolean`                      | `false`                             | 是否启用内容清洗（防 XSS）    |
| `sanitize-options`         | `SanitizeOptions`              | `{}`                                | 内容清洗配置项                |

### CodeBlockAction 类型

```ts
interface CodeBlockAction {
  key: string;
  icon?: Component | FunctionalComponent | string;
  title?: string;
  onClick?: (props: CodeBlockSlotProps) => void;
  disabled?: boolean;
  class?: string;
  style?: Record<string, string>;
  show?: (props: CodeBlockSlotProps) => boolean;
}
```

### MermaidAction 类型

```ts
interface MermaidAction {
  key: string;
  icon?: Component | FunctionalComponent | string;
  title?: string;
  onClick?: (props: MermaidSlotProps) => void;
  disabled?: boolean;
  class?: string;
  style?: Record<string, string>;
  show?: (props: MermaidSlotProps) => boolean;
}
```
